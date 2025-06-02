import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { animate } from "animejs";
import Row from "../../../components/Row";
import Heading from "../../../components/Heading";
import UtilityBillList from "../../../components/UtilityBillList";
import UtilityBillUpload from "../../../components/UtilityBillUpload";

const PageContainer = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 
    0 4px 32px rgba(0, 0, 0, 0.04),
    0 2px 16px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
  margin: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0.5rem;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    border-radius: 2px;
  }
`;

const StyledHeading = styled(Heading)`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: var(--letter-spacing-tight);
  margin-bottom: 0.5rem;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);

  @media (max-width: 768px) {
    font-size: var(--font-size-2xl);
  }
`;

const Description = styled.p`
  color: var(--dashboard-text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 480px) {
    padding: 0.625rem 1.25rem;
    font-size: var(--font-size-xs);
  }
`;

const ListContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 2px 16px rgba(0, 0, 0, 0.03),
    0 1px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.05),
      0 2px 12px rgba(0, 0, 0, 0.03);
  }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  position: relative;
  font-size: 1.1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  
  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export default function UtilityBills() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Faster animations
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutCubic',
        delay: 100
      });
    }

    if (headerRef.current) {
      animate(headerRef.current, {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 350,
        easing: 'easeOutCubic',
        delay: 200
      });
    }

    if (listRef.current) {
      animate(listRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 300,
        easing: 'easeOutCubic',
        delay: 300
      });
    }
  }, []);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
  };

  return (
    <>
      <PageContainer ref={containerRef}>
        <HeaderSection ref={headerRef}>
          <Row type="horizontal" justify="between">
            <div>
              <StyledHeading as="h1">Utility Bills Management</StyledHeading>
              <Description>Upload and manage utility bills for apartments</Description>
            </div>
            <UploadButton onClick={() => setIsModalOpen(true)}>
              Upload Utility Bill +
            </UploadButton>
          </Row>
        </HeaderSection>
        
        <ListContainer ref={listRef}>
          <UtilityBillList refreshTrigger={refreshTrigger} />
        </ListContainer>
      </PageContainer>

      <ModalOverlay isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={() => setIsModalOpen(false)}>
            ×
          </CloseButton>
          <h2 style={{ marginBottom: '1.5rem', color: '#1f2937', fontSize: '1.6rem' }}>Upload Utility Bill</h2>
          <UtilityBillUpload onSuccess={handleUploadSuccess} />
        </ModalContent>
      </ModalOverlay>
    </>
  );
}
