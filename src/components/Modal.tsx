import {
  cloneElement,
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";

// Styled components
const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh;
  max-width: 90vw;
  width: auto;
  min-width: 400px;
  background: var(--color-grey-0);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
  animation: modalSlideIn 0.3s var(--transition-spring);
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @media (max-width: 640px) {
    min-width: 90vw;
    max-height: 85vh;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.60);
  backdrop-filter: blur(8px);
  z-index: 1000;
  animation: overlayFadeIn 0.25s ease-out;
  
  @keyframes overlayFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(8px);
    }
  }
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-6) var(--space-4);
  border-bottom: 1px solid var(--color-grey-200);
`;

const ModalBody = styled.div`
  padding: var(--space-6);
  overflow-y: auto;
  flex: 1;
  
  /* Custom scrollbar for modal */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: var(--border-radius-full);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: var(--border-radius-full);
    
    &:hover {
      background: var(--color-grey-400);
    }
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-grey-100);
  border: none;
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-600);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-red-100);
    color: var(--color-red-600);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }

  & svg {
    width: 18px;
    height: 18px;
  }
`;

const Title = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-grey-900);
  margin: 0;
  letter-spacing: -0.025em;
`;

// Context and modal logic
interface ModalContextType {
  openName: string;
  open: (name: string) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProps {
  children: ReactNode;
}

export default function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState<string>("");

  const close = () => setOpenName("");
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps {
  children: ReactNode;
  id: string;
}

function Open({ children, id: opensWindowName }: OpenProps) {
  const { open } = useContext(ModalContext)!;

  return cloneElement(children as React.ReactElement, {
    onClick: () => open(opensWindowName),
  });
}

interface WindowProps {
  children: ReactNode;
  id: string;
  name: string;
}

function Window({ children, id, name }: WindowProps) {
  const { openName, close } = useContext(ModalContext)!;
  if (id !== openName) return null;

  return createPortal(
    <Overlay onClick={close}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>{name}</Title>
          <Button onClick={close}>
            <HiXMark />
          </Button>
        </ModalHeader>
        
        <ModalBody>
          {cloneElement(children as React.ReactElement, {
            onCloseModal: close,
          })}
        </ModalBody>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;
