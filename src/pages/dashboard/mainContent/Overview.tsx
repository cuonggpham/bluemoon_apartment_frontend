import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { animate } from "animejs";
import Heading from "../../../components/Heading";
import { FcCalendar } from "react-icons/fc";
import Cards from "../../../components/Cards";
import ApartmentFeeChart from "../../../components/ApartmentFeeChart";
import ApartmentChart from "../../../components/ApartmentChart";
import ResidentsChart from "../../../components/ResidentChart";

const StyledHeading = styled(Heading)`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CalendarStyled = styled.label`
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1f2937;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
    color: #111827;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
    gap: 0.25rem;
  }
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }

  h2 {
    font-size: 2.375rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    position: relative;
    z-index: 1;
    line-height: 1.2;
    color:white;
  }

  p {
    font-size: 1.525rem;
    font-weight: 500;
    opacity: 0.95;
    position: relative;
    z-index: 1;
    line-height: 1.4;
    color:white;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    
    h2 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

function Calendar() {
  const today = new Date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  return (
    <CalendarStyled>
      <FcCalendar size={20} />
      {`${month} ${year}, ${day}`}
    </CalendarStyled>
  );
}

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  padding: 1.5rem;
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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const ChartFullWidth = styled.div`
  grid-column: 1 / -1;
`;

export default function Overview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Faster container entrance animation
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutCubic',
        delay: 100
      });
    }

    // Faster welcome card animation
    if (welcomeRef.current) {
      animate(welcomeRef.current, {
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 350,
        easing: 'easeOutCubic',
        delay: 200
      });
    }

    // Faster cards section animation
    if (cardsRef.current) {
      animate(cardsRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 300,
        easing: 'easeOutCubic',
        delay: 250
      });
    }

    // Faster charts section animation
    if (chartsRef.current) {
      animate(chartsRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 300,
        easing: 'easeOutCubic',
        delay: 300
      });
    }
  }, []);

  return (
    <DashboardContainer ref={containerRef}>
      <HeaderSection>
        <StyledHeading as="h1">Dashboard Overview</StyledHeading>
        <Calendar />
      </HeaderSection>

      <WelcomeCard ref={welcomeRef}>
        <h2>Welcome back, Manager!</h2>
        <p>Here's what's happening with your property management today.</p>
      </WelcomeCard>

      <div ref={cardsRef}>
        <Cards />
      </div>
      
      <ChartsSection ref={chartsRef}>
        <ApartmentChart />
        <ResidentsChart />
      </ChartsSection>
      
      <ChartFullWidth>
        <ApartmentFeeChart />
      </ChartFullWidth>
    </DashboardContainer>
  );
}
