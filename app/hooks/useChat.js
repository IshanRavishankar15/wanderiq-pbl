'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';

export const useChat = ({ itinerary, applyUpdatedItinerary }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatMode, setChatMode] = useState('ask');
    const isInitialized = useRef(false);

    useEffect(() => {
        if (itinerary && itinerary.summary && !isInitialized.current) {
            const initialMessage = `${itinerary.summary} You can ask me anything about this itinerary!`;
            setMessages([{ role: 'assistant', content: initialMessage }]);
            isInitialized.current = true;
        }
    }, [itinerary]); 

    const sendMessage = useCallback(async (newMessageContent) => {
        if (!newMessageContent.trim() || !itinerary) return;

        const newUserMessage = { role: 'user', content: newMessageContent };
        const updatedMessages = [...messages, newUserMessage];
        
        setMessages(updatedMessages);
        setLoading(true);

        try {
            let assistantMessage;

            if (chatMode === 'ask') {
                const response = await axios.post('/api/chat', { 
                    messages: updatedMessages, 
                    itinerary 
                });
                assistantMessage = {
                    role: 'assistant',
                    content: response.data.content || "I'm not sure how to respond to that."
                };
            } else { 
                const response = await axios.post('/api/customize-itinerary', {
                    userRequest: newMessageContent,
                    itinerary
                });
                
                if (response.data.updatedItinerary) {
                    applyUpdatedItinerary(response.data.updatedItinerary);
                }

                assistantMessage = {
                    role: 'assistant',
                    content: response.data.textresponse || "I've made the changes you requested."
                };
            }
            
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMessage = { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
        
    }, [messages, itinerary, chatMode, applyUpdatedItinerary]);

    const toggleChatMode = () => {
        setChatMode(prev => (prev === 'ask' ? 'customize' : 'ask'));
    };

    return { messages, loading, sendMessage, chatMode, toggleChatMode };
};