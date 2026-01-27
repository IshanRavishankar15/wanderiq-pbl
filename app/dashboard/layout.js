'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* background: transparent; // Default is transparent, so we don't even need this line */
`;

const MainContent = styled.main`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  
  /* Optional: Ensure content has enough space at the bottom */
  padding-bottom: 2rem; 
`;

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ai-travel-theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <DashboardWrapper>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut"}}
          style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }} // Ensure motion div fills space
        >
          <MainContent>{children}</MainContent>
        </motion.div>
      </AnimatePresence>
    </DashboardWrapper>
  );
}