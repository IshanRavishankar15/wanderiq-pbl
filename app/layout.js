import { Quicksand } from 'next/font/google';
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry';
// 1. Import Toaster
import { Toaster } from 'react-hot-toast';

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'WanderIQ',
  description: 'Generate personalized travel itineraries with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <StyledComponentsRegistry>
          {/* 2. Add Toaster here */}
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}