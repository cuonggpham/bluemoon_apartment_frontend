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

// Enhanced styled components with modern design
const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 92vh;
  max-width: 95vw;
  width: auto;
  min-width: 480px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.12),
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.94);
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      backdrop-filter: blur(20px);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.02), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    min-width: 92vw;
    max-height: 90vh;
    border-radius: 16px;
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }

  @media (max-width: 480px) {
    min-width: 95vw;
    border-radius: 12px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  animation: overlayFadeIn 0.3s ease-out;
  
  @keyframes overlayFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(12px);
    }
  }
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 2rem 1.25rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6));
  backdrop-filter: blur(10px);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 2rem;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #4f46e5);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1rem;

    &::after {
      left: 1.5rem;
      width: 50px;
    }
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937, #374151);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.375rem;
  }
`;

const Button = styled.button`
  background: rgba(0, 0, 0, 0.08);
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.375rem;
  color: #6b7280;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 10px;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    transform: scale(0.98);
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  & svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  position: relative;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.8);
    border-radius: 10px;
    margin: 0.5rem;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #cbd5e1, #94a3b8);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
    
    &:hover {
      background: linear-gradient(135deg, #94a3b8, #64748b);
      background-clip: content-box;
    }
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
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
