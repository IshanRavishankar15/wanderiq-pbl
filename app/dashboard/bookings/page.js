'use client';
import styled from 'styled-components';

const PageWrapper = styled.div`
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

/**
 * Placeholder page for viewing and confirming bookings.
 */
export default function BookingsPage() {
    return (
        <PageWrapper>
            <Title>My Bookings</Title>
            <p>Your saved flights and hotels will appear here.</p>
            {/* Logic to display saved bookings from useItinerary hook would go here */}
        </PageWrapper>
    );
}