import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { animate } from 'animejs';
import { HiOutlinePlusCircle } from "react-icons/hi2";
import Heading from '../../../components/Heading';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import PaymentRecordForm from '../../../features/payment-records/PaymentRecordForm';
import PaymentRecordTable from '../../../features/payment-records/PaymentRecordTable';

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
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.02), transparent);
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #22c55e, #16a34a);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledHeading = styled(Heading)`
  background: linear-gradient(135deg, #22c55e, #16a34a);
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

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

const ContentSection = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 
    0 2px 16px rgba(0, 0, 0, 0.03),
    0 1px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.05),
      0 2px 12px rgba(0, 0, 0, 0.03);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export default function PaymentRecording() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Container animation
    if (containerRef.current) {
      animate(containerRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutCubic',
        delay: 100
      });
    }

    // Header animation
    if (headerRef.current) {
      animate(headerRef.current, {
        translateX: [-20, 0],
        opacity: [0, 1],
        duration: 350,
        easing: 'easeOutCubic',
        delay: 200
      });
    }

    // Content animation
    if (contentRef.current) {
      animate(contentRef.current, {
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutCubic',
        delay: 300
      });
    }
  }, []);

  const handlePaymentSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <PageContainer ref={containerRef}>
      <HeaderSection ref={headerRef}>
        <HeaderContent>
          <StyledHeading as="h1">Payment Recording</StyledHeading>
          <Description>Record and manage fee payments from residents</Description>
        </HeaderContent>
        
        <Modal>
          <Modal.Open id="add-payment">
            <AddButton variation="primary" size="medium">
              <HiOutlinePlusCircle />
              Add Payment
            </AddButton>
          </Modal.Open>

          <Modal.Window id="add-payment" name="Record New Payment">
            <PaymentRecordForm onSuccess={handlePaymentSuccess} />
          </Modal.Window>
        </Modal>
      </HeaderSection>

      <ContentSection ref={contentRef}>
        <PaymentRecordTable refreshTrigger={refreshTrigger} />
      </ContentSection>
    </PageContainer>
  );
}