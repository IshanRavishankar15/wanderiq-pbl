'use client';

import styled from 'styled-components';
import { MapPin, Calendar, Users, ThumbsUp, DollarSign } from 'lucide-react';

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  margin : 0.5rem;
  background-color: var(--card-background);
  border: 1px solid var(--border);
  color: var(--foreground);
  border-radius: 20px;
  box-shadow: 0 0 15px black;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: var(--secondary);
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: var(--secondary);
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid var(--purple-border);
  border-radius: 8px;
  background-color: var(--card-background);
  color: var(--foreground);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
  }
`;

const SubmitButton = styled.button`
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    background-color: var(--primary);
    color: var(--secondary);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-elevation-medium);
        background-color: var(--primary-hover);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;


/**
 * Form for collecting user inputs to generate a travel itinerary.
 */
export default function TripForm({ onSubmit, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData.entries());
    console.log("Form Submitted with:", inputs)
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormTitle>Plan Your Adventure</FormTitle>
      
      <FieldWrapper>
        <Label htmlFor="destination">Destination</Label>
        <InputGroup>
          <InputIcon><MapPin size={18} /></InputIcon>
          <Input id="destination" type="text" name="destination" placeholder="e.g., Kyoto, Japan" required />
        </InputGroup>
      </FieldWrapper>
      
      <FieldWrapper>
        <Label htmlFor="startDate">Start Date</Label>
        <InputGroup>
          <InputIcon><Calendar size={18} /></InputIcon>
          <Input id="startDate" type="date" name="startDate" required style={{paddingLeft: '2.5rem'}} />
        </InputGroup>
      </FieldWrapper>

      <FieldWrapper>
        <Label htmlFor="endDate">End Date</Label>
        <InputGroup>
          <InputIcon><Calendar size={18} /></InputIcon>
          <Input id="endDate" type="date" name="endDate" required style={{paddingLeft: '2.5rem'}} />
        </InputGroup>
      </FieldWrapper>

      <FieldWrapper>
        <Label htmlFor="travelers">Travelers</Label>
        <InputGroup>
          <InputIcon><Users size={18} /></InputIcon>
          <Input id="travelers" type="number" name="travelers" placeholder="e.g., 2" min="1" defaultValue="2" required />
        </InputGroup>
      </FieldWrapper>

      <FieldWrapper>
        <Label htmlFor="budget">Budget</Label>
        <InputGroup>
          <InputIcon><DollarSign size={18} /></InputIcon>
          <Input id="budget" type="text" name="budget" placeholder="e.g., Approx. 10000 INR" required />
        </InputGroup>
      </FieldWrapper>

      <FieldWrapper>
        <Label htmlFor="interests">Interests</Label>
        <InputGroup>
          <InputIcon><ThumbsUp size={18} /></InputIcon>
          <Input id="interests" type="text" name="interests" placeholder="e.g., Food, history, nature" required />
        </InputGroup>
      </FieldWrapper>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Create Itinerary'}
      </SubmitButton>
    </FormWrapper>
  );
}