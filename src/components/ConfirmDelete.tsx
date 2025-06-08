import React from 'react';
import styled from 'styled-components';
import { HiExclamationTriangle } from 'react-icons/hi2';
import Button from './Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 400px;
  max-width: 500px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-red-600);
`;

const Title = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin: 0;
`;

const Message = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  line-height: 1.6;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 1rem;
`;

interface ConfirmDeleteProps {
  resourceName: string;
  onConfirm: () => void;
  disabled?: boolean;
  onCloseModal?: () => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  resourceName,
  onConfirm,
  disabled = false,
  onCloseModal,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onCloseModal?.();
  };

  return (
    <Container>
      <Header>
        <IconWrapper>
          <HiExclamationTriangle size={24} />
        </IconWrapper>
        <Title>Delete {resourceName}</Title>
      </Header>
      
      <Message>
        Are you sure you want to delete this {resourceName}? This action cannot be undone.
      </Message>

      <ButtonGroup>
        <Button
          variation="secondary"
          size="medium"
          onClick={onCloseModal}
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button
          variation="danger"
          size="medium"
          onClick={handleConfirm}
          disabled={disabled}
        >
          Delete
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default ConfirmDelete; 