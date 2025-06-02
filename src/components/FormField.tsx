import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { capitalize } from "../utils/helpers";

// ---------- Styled Components ----------

const StyledFormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: var(--space-1);
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

const StyledInput = styled.input`
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-lg);
  font-size: 1.1rem;
  font-family: inherit;
  background-color: var(--color-grey-0);
  color: #1f2937;
  transition: all var(--transition-fast);
  min-height: 48px;
  font-weight: 500;
  
  &::placeholder {
    color: #6b7280;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
    background-color: var(--color-grey-0);
  }
  
  &:hover:not(:focus) {
    border-color: var(--color-grey-400);
  }

  &.error {
    border-color: var(--color-red-500);
    background-color: var(--color-red-50);
    
    &:focus {
      border-color: var(--color-red-500);
      box-shadow: 0 0 0 3px var(--color-red-100);
    }
  }
  
  &:disabled {
    background-color: var(--color-grey-100);
    color: var(--color-grey-500);
    cursor: not-allowed;
    border-color: var(--color-grey-200);
  }
`;

const StyledSelect = styled.select`
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-lg);
  font-size: 1.1rem;
  font-family: inherit;
  background-color: var(--color-grey-0);
  color: #1f2937;
  transition: all var(--transition-fast);
  min-height: 48px;
  cursor: pointer;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
  
  &:hover:not(:focus) {
    border-color: var(--color-grey-400);
  }

  &.error {
    border-color: var(--color-red-500);
    background-color: var(--color-red-50);
    
    &:focus {
      border-color: var(--color-red-500);
      box-shadow: 0 0 0 3px var(--color-red-100);
    }
  }
  
  &:disabled {
    background-color: var(--color-grey-100);
    color: var(--color-grey-500);
    cursor: not-allowed;
    border-color: var(--color-grey-200);
  }
`;

const StyledErrorMessage = styled.div`
  color: var(--color-red-600);
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// ---------- Props Definitions ----------

interface LabelProps {
  label: string;
  htmlFor?: string;
  className?: string;
  required?: boolean;
}

interface InputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
}

interface SelectProps {
  id: string;
  options: string[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

// ---------- Subcomponents ----------

const Label: React.FC<LabelProps> = ({ label, htmlFor, className, required }) => (
  <StyledLabel 
    htmlFor={htmlFor} 
    className={`${className || ''} ${required ? 'required' : ''}`}
  >
    {label}
  </StyledLabel>
);

const Input: React.FC<InputProps> = ({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly,
  disabled,
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
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
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
  placeholder = "Select an option",
  className,
  required,
  disabled,
  error,
}) => (
  <StyledFieldContainer>
    <StyledSelect
      id={id}
      value={value}
      onChange={onChange}
      className={`${className || ''} ${error ? 'error' : ''}`}
      required={required}
      disabled={disabled}
      title={placeholder}
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
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
} = ({ label, required, error, children }) => {
  return (
    <StyledFormField>
      {label && <Label label={label} required={required} />}
      {children}
      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
    </StyledFormField>
  );
};

// Attach subcomponents
FormField.Label = Label;
FormField.Input = Input;
FormField.Select = Select;

export default FormField;
