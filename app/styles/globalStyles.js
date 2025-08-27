'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    
    /* Light Theme */
    --background-light: #fff8f8ff;
    --foreground-light: #111827;
    --card-background-light: #fdfaffff;
    --secondary-light: #000000ff;
    --border-light: #e5e7eb;
    --primary-light: #d9aeffff;
    --primary-hover-light: #e0bfffff;

    /* Dark Theme */
    --background-dark: #10001fff;
    --foreground-dark: #e5e7eb;
    --card-background-dark: #1f2937;
    --secondary-dark: #ffffffff;
    --border-dark: #374151;
    --primary-dark: #9333ea;
    --primary-hover-dark: #a855f7;

    /* Accent Colors (Purple) */
    --primary-foreground: #ffffff;
    --purple-background: #26095cff;
    --purple-card-background: #251347ff;
    --purple-border: #4b347dff;

    /* Default to Dark Theme Variables */
    --background: var(--background-dark);
    --foreground: var(--foreground-dark);
    --card-background: var(--card-background-dark);
    --secondary: var(--secondary-dark);
    --border: var(--border-dark);
    --primary: var(--primary-dark);
    --primary-hover: var(--primary-hover-dark);

    --shadow-color: 220 40% 2%;
    --shadow-elevation-low:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.34),
      0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.34),
      1px 2px 2.5px -2.5px hsl(var(--shadow-color) / 0.34);
    --shadow-elevation-medium:
      0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
      0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
      2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
      5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
  }

  /* Class for explicit light mode */
  .light-mode {
    --background: var(--background-light);
    --foreground: var(--foreground-light);
    --card-background: var(--card-background-light);
    --secondary: var(--secondary-light);
    --border: var(--border-light);
    --shadow-color: 220 3% 15%;
    --primary: var(--primary-light);
    --primary-hover: var(--primary-hover-light);
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    font-family: var(--font-sans);
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    transition: background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export default GlobalStyles;