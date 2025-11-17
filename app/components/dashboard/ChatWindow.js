
'use client';

import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Loader2, Edit, MessageSquare } from 'lucide-react';

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 120px);
  background-color: var(--card-background);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 0 3px #4a4a4aff;
  overflow: visible; 
  margin: 3px
`;


const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  flex-shrink: 0;
`;

const ModeToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background-color: var(--background);
  color: var(--secondary);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div`
  display: flex;
  max-width: 90%;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background-color: var(--primary);
  color: var(--secondary);
  border-top-left-radius: ${props => props.$isUser ? '12px' : '0px'};
  border-top-right-radius: ${props => props.$isUser ? '0px' : '12px'};
`;

const InputArea = styled.form`
  display: flex;
  padding: 1rem;
  border-top: 1px solid var(--border);
  gap: 0.5rem;
  flex-shrink: 0;
`;

const TextInput = styled.input`
  flex-grow: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const SendButton = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--secondary);
    padding: 0.5rem 1rem;
    animation: pulse 1.5s infinite ease-in-out;
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;

export default function ChatWindow({ messages, loading, onSendMessage, chatMode, onToggleMode }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    useEffect(scrollToBottom, [messages, loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(input);
        setInput('');
    };

    const placeholderText = chatMode === 'ask' 
        ? "Ask a question about your trip..."
        : "e.g., Change day 2 to be more relaxed";

    return (
        <ChatWrapper>
            <ChatHeader>
                <span>{chatMode === 'ask' ? 'Ask your AI Assistant' : 'Customize Itinerary'}</span>
                <ModeToggleButton onClick={onToggleMode}>
                    {chatMode === 'ask' ? <Edit size={14} /> : <MessageSquare size={14} />}
                    <span>{chatMode === 'ask' ? 'Customize' : 'Ask'}</span>
                </ModeToggleButton>
            </ChatHeader>
            <MessagesContainer>
                {messages.map((msg, index) => (
                    <MessageBubble key={index} $isUser={msg.role === 'user'}>
                        <MessageContent $isUser={msg.role === 'user'}>
                            {msg.content}
                        </MessageContent>
                    </MessageBubble>
                ))}
                {loading && (
                    <TypingIndicator>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }}/>
                        WanderIQ is thinking...
                    </TypingIndicator>
                )}
                <div ref={messagesEndRef} />
            </MessagesContainer>
            <InputArea onSubmit={handleSubmit}>
                <TextInput
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholderText}
                    disabled={loading}
                />
                <SendButton type="submit" disabled={loading || !input.trim()}>
                    <Send size={18} />
                </SendButton>
            </InputArea>
        </ChatWrapper>
    );
}