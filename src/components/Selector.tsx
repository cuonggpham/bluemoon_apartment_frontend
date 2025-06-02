import { createContext, useContext, useState } from "react";
import styled from "styled-components";
import { capitalize } from "../utils/helpers";

// Enhanced styled components with larger fonts and darker colors
const StyledSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
`;

const StyledSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3); /* Increased gap between options */
`;

const StyledSelectorLabel = styled.label`
  font-size: 1.3rem; /* Increased font size */
  font-weight: 600; /* Increased font weight */
  color: #1f2937; /* Darker color for better visibility */
  margin-top: 1.5rem;
  margin-bottom: var(--space-2);
  letter-spacing: -0.01em;
  
  &.required::after {
    content: "*";
    color: var(--color-red-500);
    margin-left: var(--space-1);
    font-weight: 600;
  }
  
  &:first-child {
    margin-top: 0;
  }
`;

const StyledOption = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3); /* Increased gap between radio and label */
  cursor: pointer;
  padding: var(--space-2); /* Added padding for better touch target */
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const StyledInput = styled.input`
  width: 28px; /* Increased from 24px */
  height: 28px; /* Increased from 24px */
  appearance: none;
  border: 2px solid var(--color-grey-400); /* Increased border width */
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  background-color: var(--color-grey-100);
  position: relative;
  flex-shrink: 0;

  &:checked {
    background-color: var(--color-green-500);
    border-color: var(--color-green-600); /* Darker border when checked */
  }
  
  &:checked::after {
    content: '';
    width: 12px; /* Increased from 10px */
    height: 12px; /* Increased from 10px */
    border-radius: 50%;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    border-color: var(--color-grey-600);
    transform: scale(1.05); /* Added hover effect */
  }

  &:focus {
    border-color: var(--color-blue-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* Increased shadow */
  }
`;

const StyledOptionLabel = styled.label`
  font-size: 1.1rem; /* Significantly increased font size for radio options */
  font-weight: 600; /* Increased font weight */
  color: #1f2937; /* Darker color for better readability */
  cursor: pointer;
  letter-spacing: -0.01em;
  line-height: 1.4;
  user-select: none;
  
  &:hover {
    color: #111827; /* Even darker on hover */
  }
`;

const StyledErrorMessage = styled.div`
  color: var(--color-red-600);
  font-size: 0.9rem; /* Increased error message font size */
  font-weight: 600; /* Increased font weight */
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

// const SelectorContext = createContext();

// export default function Selector({
//   id,
//   children,
//   type,
//   value: defaultValue,
//   onChange,
// }) {
//   const [selection, setSelection] = useState(defaultValue || "");

//   const select = setSelection;

//   console.log(selection);

//   return (
//     <SelectorContext.Provider value={{ selection, select, onChange }}>
//       <StyledSelector id={id} type={type} value={selection}>
//         {children}
//       </StyledSelector>
//     </SelectorContext.Provider>
//   );
// }

// function Option({ option }) {
//   const { selection, select, onChange } = useContext(SelectorContext);
//   return (
//     <StyledOption>
//       <StyledInput
//         type="radio"
//         id={option}
//         checked={selection === option}
//         value={option}
//         onChange={(e) => {
//           select(option), onChange(e.target.value);
//         }}
//       />
//       <label>{capitalize(option)}</label>
//     </StyledOption>
//   );
// }

// Selector.Option = Option;

export default function Selector({ options, onChange, id, value, label, required, error }) {
  const handleRadioChange = (e: any) => {
    // Create a synthetic event that mimics the structure expected by form handlers
    const syntheticEvent = {
      target: {
        id: id, // Use the id as the field identifier
        value: e.target.value, // Use the radio value
        name: id
      }
    };
    onChange(syntheticEvent);
  };

  return (
    <StyledSelectorContainer>
      <StyledSelector id={id}>
        <StyledSelectorLabel className={required ? 'required' : ''}>
          {label}
        </StyledSelectorLabel>
        {options.map((option) => (
          <StyledOption key={option}>
            <StyledInput
              type="radio"
              id={`${id}-${option}`}
              name={id}
              value={option}
              checked={value === option}
              onChange={handleRadioChange}
              required={required}
            />
            <StyledOptionLabel htmlFor={`${id}-${option}`}>
              {capitalize(option)}
            </StyledOptionLabel>
          </StyledOption>
        ))}
      </StyledSelector>
      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
    </StyledSelectorContainer>
  );
}
