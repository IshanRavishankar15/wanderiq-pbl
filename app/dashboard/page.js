'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import { useItinerary } from '@/hooks/useItinerary';
import { useChat } from '@/hooks/useChat';

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

  const searchParams = useSearchParams();
  const prefilledDestination = searchParams.get('destination');

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

  const { 
    itinerary, 
    flightSuggestions, 
    isLoading, 
    error,
    generateItinerary, 
    applyUpdatedItinerary, 
    saveCurrentItinerary 
  } = useItinerary();
  
  const handleItineraryUpdate = (newItinerary) => {
    applyUpdatedItinerary(newItinerary);
    setItineraryKey(Date.now());
  };

  const { messages, loading: chatLoading, sendMessage, chatMode, toggleChatMode } = useChat({ itinerary, applyUpdatedItinerary: handleItineraryUpdate });

  const handleFormSubmit = async (inputs) => {
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

        {!isLoading && itinerary && flightSuggestions && (
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
              <SuggestionsPanel flights={flightSuggestions} />
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