import { Quicksand } from 'next/font/google';
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider'; 

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
          <AuthProvider> 
             <Toaster position="top-center" reverseOrder={false} />
             {children}
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}