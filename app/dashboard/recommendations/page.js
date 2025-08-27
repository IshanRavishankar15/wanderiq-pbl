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
 * Placeholder page for AI-driven travel recommendations.
 */
export default function RecommendationsPage() {
    return (
        <PageWrapper>
            <Title>Personalized Recommendations</Title>
            <p>Based on your travel style and previous trips, we'll recommend new destinations for you here.</p>
        </PageWrapper>
    );
}