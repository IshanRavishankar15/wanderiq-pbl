'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    
    --background-light: #ffffff;
    --foreground-light: #111827;
    --card-background-light: rgba(255, 255, 255, 0.4); 
    --navbar-background-light: #ffffff;
    --secondary-light: #000000;
    --border-light: rgba(0, 0, 0, 0.1);
    --primary-light: #d9aeff;
    --primary-hover-light: #e0bfff;

    --background-dark: #000000;
    --foreground-dark: #e5e7eb;
    --card-background-dark: rgba(20, 20, 20, 0.69);
    --navbar-background-dark: #131313;
    --secondary-dark: #ffffff;
    --border-dark: rgba(255, 255, 255, 0.1);
    --primary-dark: #9333ea;
    --primary-hover-dark: #ae56ff;

    --background: var(--background-dark);
    --foreground: var(--foreground-dark);
    --card-background: var(--card-background-dark);
    --navbar-background: var(--navbar-background-dark);
    --secondary: var(--secondary-dark);
    --border: var(--border-dark);
    --primary: var(--primary-dark);
    --primary-hover: var(--primary-hover-dark);
    
    --backdrop-blur: blur(20px);
  }

  .light-mode {
    --background: var(--background-light);
    --foreground: var(--foreground-light);
    --card-background: var(--card-background-light);
    --navbar-background: var(--navbar-background-light);
    --secondary: var(--secondary-light);
    --border: var(--border-light);
    --primary: var(--primary-light);
    --primary-hover: var(--primary-hover-light);
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html, body {
    width: 100%;
    min-height: 100vh;
    font-family: var(--font-sans);
  }

  body {
    color: var(--foreground);
    background-color: transparent; 
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -50;
    
    background-color: var(--background);
    
    background-image: 
      radial-gradient(circle at 0% 50%, rgba(147, 51, 234, 0.3), transparent 50%),
      radial-gradient(circle at 100% 50%, rgba(126, 34, 206, 0.3), transparent 50%);
      
    background-repeat: no-repeat;
    background-size: cover;
    transition: background-color 0.5s ease;
  }

  .light-mode body::before {
    background-image: 
      radial-gradient(circle at 0% 50%, rgba(216, 180, 254, 0.6), transparent 50%),
      radial-gradient(circle at 100% 50%, rgba(192, 132, 252, 0.5), transparent 50%);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  div[class*="Card"], 
  div[class*="Panel"], 
  div[class*="Wrapper"], 
  div[class*="Container"] {
     backdrop-filter: var(--backdrop-blur);
     -webkit-backdrop-filter: var(--backdrop-blur);
  }

  nav, header, div[class*="Navbar"] {
     backdrop-filter: none !important;
     -webkit-backdrop-filter: none !important;
  }
`;

export default GlobalStyles;