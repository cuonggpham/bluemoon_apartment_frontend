import { createContext, useContext, useState } from "react";
import styled from "styled-components";
import { capitalize } from "../utils/helpers";

const StyledSelector = styled.div`
  border: none;
  background-color: var(--color-grey-0);
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
  align-items: center;
  transition: none;
  padding: 6px 6px 6px 0px;
  width: 100%;
`;

const StyledSelectorLabel = styled.label`
  font-weight: 500;
  position: relative;

  &.required::after {
    content: "*";
    color: red;
    margin-left: 4px;
    font-weight: bold;
  }
`;

const StyledErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
`;

const StyledSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledOptionLabel = styled.label`
  cursor: pointer;
  user-select: none;
  font-size: 0.9rem;
  color: var(--color-grey-700);
  
  &:hover {
    color: var(--color-grey-900);
  }
`;

const StyledOption = styled.div`
  border: none;
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StyledInput = styled.input`
  width: 24px;
  height: 24px;
  appearance: none;
  border: 1px solid var(--color-grey-400);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  background-color: var(--color-grey-100);
  position: relative;
  flex-shrink: 0;

  &:checked {
    background-color: var(--color-green-500);
    border-color: var(--color-grey-400);
  }
  &:checked::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    border-color: var(--color-grey-600);
  }

  &:focus {
    border-color: var(--color-blue-500);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
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
        </StyledSelectorLabel>        {options.map((option) => (
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
