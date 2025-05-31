import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

// Styled components with types
interface StyledFormProps {
  width?: string;
}

const StyledForm = styled.form<StyledFormProps>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 36px 0px 36px;
  border-radius: 20px;
  background-color: var(--color-grey-0);
  ${(props) =>
    css`
      width: ${props.width || "500px"};
    `}
  overflow: hidden;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
`;

interface FieldsProps {
  type?: "vertical" | "horizontal";
}

const Fields = styled.div<FieldsProps>`
  ${(props) =>
    props.type === "vertical" &&
    css`
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 12px 12px;
    `}
  ${(props) =>
    props.type === "horizontal" &&
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 12px 12px;
    `}
  width: 100%;
`;

Fields.defaultProps = {
  type: "vertical" as "vertical",
};

const Buttons = styled.div`
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 160px;
  padding: 16px;
  border: 1px solid var(--color-grey-700);
  border-radius: 15px;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  color: #1f2937;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
  
  &::placeholder {
    color: #6b7280;
    font-weight: 400;
  }
`;

interface FormProps {
  children: ReactNode;
  width?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

// Extending React.FC to allow additional properties (Buttons, Fields, TextArea)
interface FormComponent extends React.FC<FormProps> {
  Buttons: React.ElementType;
  Fields: React.ElementType;
  TextArea: React.ElementType;
}

const Form: FormComponent = ({ children, width, onSubmit }) => {
  return (
    <StyledForm width={width} onSubmit={onSubmit}>
      {children}
    </StyledForm>
  );
};

Form.Buttons = Buttons;
Form.Fields = Fields;
Form.TextArea = TextArea;

export default Form;
