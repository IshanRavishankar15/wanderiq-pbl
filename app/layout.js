import StyledComponentsRegistry from '@/components/StyledComponentsRegistry';

export const metadata = {
  title: 'WanderIQ',
  description: 'Generate personalized travel itineraries with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}