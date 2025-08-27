'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plane, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Ubuntu } from 'next/font/google';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const NavWrapper = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border);
  color: var(--foreground);
  transition: background-color 0.5s, color 0.5s, border-color 0.5s;
`;

const NavLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
`;

const NavCenter = styled.nav`
  display: flex;
  justify-content: center;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 0.5rem;
  background-color: var(--border);
  padding: 0.25rem;
  border-radius: 50px;
  transition: background-color 0.5s;
`;

const NavItem = styled(motion.li)`
  position: relative;
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--secondary);
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease, background 0.3s;

  &.active {
    color: var(--secondary);
    font-size: 0.91rem;
    font-weight: 520;
  }
`;

const HoverIndicator = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 50px;
  background: var(--primary);
  z-index: 0;
`;

const NavRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--secondary);
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: var(--purple-border);
    color: white;
  }
`;

const navItems = [
  { href: '/dashboard', label: 'Create Itinerary' },
  { href: '/dashboard/bookings', label: 'Bookings' },
  { href: '/dashboard/previous', label: 'Previous Trips' },
  { href: '/dashboard/recommendations', label: 'Recommendations' },
];

/**
 * Main navigation bar for the dashboard.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [isLightMode, setIsLightMode] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(pathname);

  useEffect(() => {
    const isLight = document.body.classList.contains('light-mode');
    setIsLightMode(isLight);
    setHoveredPath(pathname); // Sync hover state with path changes
  }, [pathname]);

  const toggleTheme = () => {
    document.body.classList.toggle('light-mode');
    const newIsLight = document.body.classList.contains('light-mode');
    setIsLightMode(newIsLight);
    localStorage.setItem('ai-travel-theme', newIsLight ? 'light' : 'dark');
  };
  
  return (
    <NavWrapper>
      <NavLeft>
        <Logo href="/dashboard" className={ubuntu.className}>
          <Plane size={30} color="#9333ea" />
          <span>WanderIQ</span>
        </Logo>
      </NavLeft>
      <NavCenter>
        <NavLinks onMouseLeave={() => setHoveredPath(pathname)}>
          {navItems.map((item) => (
            <NavItem 
              key={item.href}
              onMouseEnter={() => setHoveredPath(item.href)}
              whileHover={{ scale: 1.05 }}
              transition={{type: 'spring', stiffness: 300, damping: 20}}
            >
              <NavLink href={item.href} className={pathname === item.href ? 'active' : ''}>
                {item.label}
              </NavLink>
              {hoveredPath === item.href && (
                <HoverIndicator
                  layoutId="navbar-indicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </NavItem>
          ))}
        </NavLinks>
      </NavCenter>
      <NavRight>
        <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
          {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
        </ThemeToggle>
      </NavRight>
    </NavWrapper>
  );
}