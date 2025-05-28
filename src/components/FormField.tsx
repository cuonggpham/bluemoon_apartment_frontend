import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { capitalize } from "../utils/helpers";

// ---------- Styled Components ----------

const StyledFormField = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 3.5fr;
`;

const StyledLabel = styled.label`
  border: 1px solid var(--color-grey-700);
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  background-color: var(--color-grey-300);
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 100%;
  position: relative;

  &.apartments-label {
    border-radius: 20px;
    margin-bottom: 0.5rem;
  }

  &.required::after {
    content: "*";
    color: red;
    margin-left: 4px;
    font-weight: bold;
  }
`;

const StyledInput = styled.input`
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  padding: 5px 15px;
  border: 1px solid var(--color-grey-700);

  &.error {
    border-color: #dc3545;
    background-color: #fff5f5;
  }

  &:focus {
    outline: none;
    border-color: var(--color-blue-700);
  }
`;

const StyledSelect = styled.select`
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  padding: 5px 15px;
  border: 1px solid var(--color-grey-700);

  &.error {
    border-color: #dc3545;
    background-color: #fff5f5;
  }

  &:focus {
    outline: none;
    border-color: var(--color-blue-700);
  }
`;

const StyledErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
`;

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// ---------- Props Definitions ----------

interface LabelProps {
  label: string;
  className?: string;
  required?: boolean;
}

interface InputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
}

interface SelectProps {
  id: string;
  options: string[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
  error?: string;
}

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
}

// ---------- Subcomponents ----------

const Label: React.FC<LabelProps> = ({ label, className, required }) => (
  <StyledLabel className={`${className || ''} ${required ? 'required' : ''}`}>
    {label}
  </StyledLabel>
);

const Input: React.FC<InputProps> = ({
  id,
  type,
  value,
  onChange,
  readOnly,
  className,
  required,
  error,
}) => (
  <StyledFieldContainer>
    <StyledInput
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`${className || ''} ${error ? 'error' : ''}`}
      required={required}
    />
    {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
  </StyledFieldContainer>
);

const Select: React.FC<SelectProps> = ({
  id,
  options,
  value,
  onChange,
  className,
  required,
  error,
}) => (
  <StyledFieldContainer>
    <StyledSelect
      id={id}
      value={value}
      onChange={onChange}
      className={`${className || ''} ${error ? 'error' : ''}`}
      required={required}
    >
      <option value="">Select an option</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {capitalize(option)}
        </option>
      ))}
    </StyledSelect>
    {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
  </StyledFieldContainer>
);

// ---------- Main FormField Component ----------

const FormField: React.FC<FormFieldProps> & {
  Label: React.FC<LabelProps>;
  Input: React.FC<InputProps>;
  Select: React.FC<SelectProps>;
} = ({ children, error }) => {
  return (
    <div>
      <StyledFormField>{children}</StyledFormField>
      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
    </div>
  );
};

// Attach subcomponents
FormField.Label = Label;
FormField.Input = Input;
FormField.Select = Select;

export default FormField;
