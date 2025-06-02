import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { animate, stagger } from 'animejs';
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
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.02), transparent);
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
    background: linear-gradient(90deg, #7c3aed, #6d28d9);
    border-radius: 2px;
  }
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: var(--letter-spacing-tight);
  margin-bottom: 0.5rem;
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

const TabContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 2px 16px rgba(0, 0, 0, 0.03),
    0 1px 8px rgba(0, 0, 0, 0.02);
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  background: rgba(248, 250, 252, 0.8);
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
    : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #6d28d9, #5b21b6)'
      : 'rgba(124, 58, 237, 0.05)'};
    transform: translateY(-1px);
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: var(--font-size-sm);
  }
`;

const TabContent = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export default function FeePayment() {
  const [activeTab, setActiveTab] = useState<'record' | 'history'>('record');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

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

    if (tabContainerRef.current) {
      animate(tabContainerRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 300,
        easing: 'easeOutCubic',
        delay: 300
      });
    }
  }, []);

  const handlePaymentSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('history');
  };

  return (
    <PageContainer ref={containerRef}>
      <HeaderSection ref={headerRef}>
        <Title>Payment Recording</Title>
        <Description>Record and manage fee payments from residents</Description>
      </HeaderSection>
      
      <TabContainer ref={tabContainerRef}>
        <TabList>
          <Tab 
            active={activeTab === 'record'} 
            onClick={() => setActiveTab('record')}
          >
            Record Payment
          </Tab>
          <Tab 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            Payment History
          </Tab>
        </TabList>
        
        <TabContent>
          {activeTab === 'record' ? (
            <PaymentRecordForm onSuccess={handlePaymentSuccess} />
          ) : (
            <PaymentRecordTable refreshTrigger={refreshTrigger} />
          )}
        </TabContent>
      </TabContainer>
    </PageContainer>
  );
}