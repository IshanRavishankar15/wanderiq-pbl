'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import { useItinerary } from '@/hooks/useItinerary';
import { useChat } from '@/hooks/useChat';
// 1. Import Auth and Firebase
import { useAuth } from '@/components/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

import TripForm from '@/components/dashboard/TripForm';
import GeneratingAnimation from '@/components/dashboard/GeneratingAnimation';
import ItineraryDisplay from '@/components/dashboard/ItineraryDisplay';
import SuggestionsPanel from '@/components/dashboard/SuggestionsPanel';
import ChatWindow from '@/components/dashboard/ChatWindow';

const PageWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
`;
const CenteredContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const DisplayLayout = styled(motion.div)`
  display: grid;
  grid-template-columns: 350px 1fr 350px;
  gap: 1.5rem;
  height: 100%;
`;
const Column = styled.div`
  overflow-y: auto;
  height: 100%;
  padding-right: 0.5rem;
`;
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 0.95 },
};
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

function DashboardPageContent() {
  const [itineraryKey, setItineraryKey] = useState(Date.now());
  const [uiMode, setUiMode] = useState('dark');
  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams();
  const prefilledDestination = searchParams.get('destination');
  const editTripId = searchParams.get('editTripId');

  // 2. Get User from Auth
  const { user } = useAuth();

  const { 
    itinerary, 
    flightSuggestions, 
    isLoading, 
    error,
    generateItinerary, 
    applyUpdatedItinerary, 
    saveCurrentItinerary,
    setItinerary 
  } = useItinerary();

  useEffect(() => {
    const checkUiMode = () => {
        const currentMode = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        setUiMode(currentMode);
    };

    checkUiMode();

    const observer = new MutationObserver(checkUiMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // 3. MODIFIED: Handle loading logic for both Firestore (Auth) and LocalStorage (Guest)
  useEffect(() => {
    const loadTripToEdit = async () => {
        if (!editTripId) return;

        // A. If Logged In -> Fetch from Firestore
        if (user) {
            try {
                const docRef = doc(db, 'users', user.uid, 'trips', editTripId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setItinerary({ ...docSnap.data(), savedId: editTripId });
                    setIsEditing(true);
                } else {
                    toast.error("Trip not found.");
                }
            } catch (err) {
                console.error("Error loading trip:", err);
                toast.error("Failed to load trip.");
            }
        } 
        // B. If Guest -> Fetch from Local Storage
        else {
            const storedTripsRaw = localStorage.getItem('wanderiq_saved_trips');
            if (storedTripsRaw) {
                const trips = JSON.parse(storedTripsRaw);
                const tripToEdit = trips.find(t => t.savedId == editTripId);
                
                if (tripToEdit) {
                  setItinerary(tripToEdit);
                  setIsEditing(true);
                }
            }
        }
    };

    loadTripToEdit();
  }, [editTripId, user, setItinerary]); // Re-run if user status changes or ID changes

  const handleItineraryUpdate = (newItinerary) => {
    applyUpdatedItinerary(newItinerary);
    setItineraryKey(Date.now());
  };

  const { messages, loading: chatLoading, sendMessage, chatMode, toggleChatMode } = useChat({ 
      itinerary, 
      applyUpdatedItinerary: handleItineraryUpdate,
      initialMode: isEditing ? 'customize' : 'ask' 
  });

  const handleFormSubmit = async (inputs) => {
    setIsEditing(false); 
    try {
      await generateItinerary(inputs);
    } catch (err) {
      alert(`Error: ${err.message}\n\nPlease check the server terminal for more details.`);
    }
  };

  return (
    <PageWrapper>
      <AnimatePresence mode="wait">
        {isLoading && (
          <CenteredContainer key="generating" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <GeneratingAnimation 
              text="Crafting Your Adventure..."
              subText=" Our AI is exploring destinations, planning activities, and optimizing your schedule."
            />
          </CenteredContainer>
        )}

        {!isLoading && !itinerary && (
          <CenteredContainer key="form" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <TripForm 
              onSubmit={handleFormSubmit} 
              loading={isLoading} 
              prefilledDestination={prefilledDestination}
            />
          </CenteredContainer>
        )}

        {!isLoading && itinerary && (flightSuggestions || isEditing) && (
          <DisplayLayout
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Column>
              <ChatWindow
                messages={messages}
                loading={chatLoading}
                onSendMessage={sendMessage}
                chatMode={chatMode}
                onToggleMode={toggleChatMode}
              />
            </Column>
            <Column>
              <AnimatePresence mode="wait">
                <motion.div
                  key={itineraryKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ItineraryDisplay itinerary={itinerary} onSaveTrip={saveCurrentItinerary} uiMode={uiMode} />
                </motion.div>
              </AnimatePresence>
            </Column>
            <Column>
              {!isEditing && <SuggestionsPanel flights={flightSuggestions} />}
            </Column>
          </DisplayLayout>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

export default function DashboardHomePage() {
  return (
    <Suspense fallback={<CenteredContainer><GeneratingAnimation text="Loading..." /></CenteredContainer>}>
      <DashboardPageContent />
    </Suspense>
  );
}