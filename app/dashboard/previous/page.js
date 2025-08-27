'use client';
import styled from 'styled-components';
import PreviousTrips from '@/components/dashboard/PreviousTrips';

const PageWrapper = styled.div`
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

/**
 * Page for displaying previously generated trips from localStorage.
 */
export default function PreviousTripsPage() {
    return (
        <PageWrapper>
            <Title>Previous Trips</Title>
            <PreviousTrips />
        </PageWrapper>
    );
}