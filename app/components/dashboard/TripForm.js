'use client';
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { MapPin, Calendar, Users, ThumbsUp } from 'lucide-react';
import CreatableSelect from 'react-select/creatable';
import destinationData from '@/lib/destinations.json';

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 1rem 1.5rem;
  margin: 1.5rem auto;
  background-color: var(--card-background);
  border: 1px solid var(--border);
  color: var(--foreground);
  border-radius: 32px;
  box-shadow: 0 0 6px black;
  width: 950px;
  max-width: 98vw;
`;

const RowWrapper = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  margin-bottom: 0.5rem;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
  text-align: center;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  color: var(--foreground);
  pointer-events: none;
  z-index: 10;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid var(--primary); 
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--foreground);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &[type=number]::-webkit-inner-spin-button,
  &[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }

  &:focus {
    outline: none;
    border-color: var(--primary-hover);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 30%, transparent);
  }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const SubmitButton = styled.button`
  position: relative;
  align-self: center;
  width: 240px;
  padding: 0.8rem 1.5rem;
  
  background: linear-gradient(135deg, var(--primary) 0%, #d946ef 100%);
  background-size: 200% 200%;
  
  border: none;
  border-radius: 12px;
  
  /* MODIFIED: Uses secondary color (Black in Light Mode, White in Dark Mode) */
  color: var(--secondary);
  
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    /* MODIFIED: Removed scale/translate, kept only the enhanced glow */
    transform: none; 
    box-shadow: 0 0 25px rgba(147, 51, 234, 0.7);
    filter: brightness(1.1);
  }

  &:active {
    /* Kept the press-down effect */
    transform: scale(0.98);
    box-shadow: 0 2px 10px rgba(147, 51, 234, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
    transform: none;
    box-shadow: none;
    background: var(--border); 
    color: var(--secondary);
    animation: ${shimmer} 2s infinite linear;
  }
`;

const destinationOptions = destinationData.destinations.map(dest => ({
  value: dest,
  label: dest
}));

const interestOptions = [
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Beaches', label: 'Beaches' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Culinary', label: 'Culinary' },
  { value: 'History', label: 'History' },
  { value: 'Nature', label: 'Nature' },
  { value: 'Night Life', label: 'Night Life' },
  { value: 'Relaxation', label: 'Relaxation' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Sightseeing', label: 'Sightseeing' },
];

const selectStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'var(--primary)', 
    borderRadius: '8px',
    minHeight: '44px',
    boxShadow: state.isFocused ? '0 0 0 3px color-mix(in srgb, var(--primary) 30%, transparent)' : 'none',
    '&:hover': {
      borderColor: 'var(--primary-hover)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    paddingLeft: '38px',
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    color: 'var(--foreground)',
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    color: 'var(--foreground)',
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: 'var(--navbar-background)', 
    border: '1px solid var(--primary)',
    zIndex: 100
  }),
  option: (baseStyles, { isFocused, isSelected }) => ({
    ...baseStyles,
    backgroundColor: isSelected ? 'var(--primary)' : isFocused ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
    color: isSelected ? 'white' : 'var(--foreground)',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'var(--primary)',
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    border: '1px solid var(--primary)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--foreground)',
    fontWeight: '500',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'var(--foreground)',
    ':hover': {
      backgroundColor: 'var(--primary)',
      color: 'white',
    },
  }),
};

export default function TripForm({ onSubmit, loading, prefilledDestination }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [destination, setDestination] = useState(null);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    if (prefilledDestination) {
      setDestination({ value: prefilledDestination, label: prefilledDestination });
    }
  }, [prefilledDestination]); 

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData.entries());
    
    if (destination) {
      inputs.destination = destination.value;
    }
    if (interests.length > 0) {
        inputs.interests = interests.map(interest => interest.value).join(', ');
    } else {
        inputs.interests = '';
    }

    onSubmit(inputs);
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    if (endDate && value && endDate < value) {
      setEndDate("");
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormTitle>Plan Your Itinerary</FormTitle>
      <RowWrapper>
        <FieldWrapper style={{flex: 1}}>
          <Label htmlFor="destination">Destination</Label>
          <InputGroup>
            <InputIcon><MapPin size={18} /></InputIcon>
            <CreatableSelect
              isClearable
              id="destination"
              options={destinationOptions}
              value={destination}
              onChange={setDestination}
              placeholder="e.g., Kyoto, Japan"
              styles={selectStyles}
              required
            />
          </InputGroup>
        </FieldWrapper>
        <FieldWrapper style={{flex: 1}}>
          <Label htmlFor="startDate">Start Date</Label>
          <InputGroup>
            <InputIcon><Calendar size={18} /></InputIcon>
            <Input
              id="startDate"
              type="date"
              name="startDate"
              required
              style={{paddingLeft: '2.5rem'}}
              min={todayStr}
              value={startDate}
              onChange={handleStartDateChange}
            />
          </InputGroup>
        </FieldWrapper>
        <FieldWrapper style={{flex: 1}}>
          <Label htmlFor="endDate">End Date</Label>
          <InputGroup>
            <InputIcon><Calendar size={18} /></InputIcon>
            <Input
              id="endDate"
              type="date"
              name="endDate"
              required
              style={{paddingLeft: '2.5rem'}}
              min={startDate ? startDate : todayStr}
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              disabled={!startDate}
            />
          </InputGroup>
        </FieldWrapper>
      </RowWrapper>
      <RowWrapper>
        <FieldWrapper style={{flex: 1}}>
          <Label htmlFor="travelers">Travelers</Label>
          <InputGroup>
            <InputIcon><Users size={18} /></InputIcon>
            <Input
              id="travelers"
              type="number"
              name="travelers"
              placeholder="e.g., 2"
              min="1"
              defaultValue="2"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              onInput={e => {
                e.target.value = e.target.value.replace(/[^\d]/g, '');
              }}
            />
          </InputGroup>
        </FieldWrapper>
        <FieldWrapper style={{flex: 1}}>
          <Label htmlFor="budget">Budget - Activities and Dining</Label>
          <InputGroup>
            <InputIcon><span style={{fontSize: 18, fontWeight: 600}}>&#8377;</span></InputIcon>
            <Input id="budget" type="text" name="budget" placeholder="e.g., 10000 INR" required />
          </InputGroup>
        </FieldWrapper>
        <FieldWrapper style={{flex: 1}}>
          <Label htmlFor="interests">Interests</Label>
          <InputGroup>
            <InputIcon><ThumbsUp size={18} /></InputIcon>
            <CreatableSelect
              isMulti
              isClearable
              id="interests"
              options={interestOptions}
              value={interests}
              onChange={setInterests}
              placeholder="e.g., Nature, Culinary..."
              styles={selectStyles}
              required
            />
          </InputGroup>
        </FieldWrapper>
      </RowWrapper>
      
      <SubmitButton type="submit" disabled={loading}>
        {loading ? 'Crafting Plan...' : 'Create Itinerary'}
      </SubmitButton>
    </FormWrapper>
  );
}