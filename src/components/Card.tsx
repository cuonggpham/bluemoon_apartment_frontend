import React, { useEffect, useRef } from 'react';
import styled from "styled-components";
import { animate, utils } from "animejs";

const CardStyled = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #111827;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 
    0 4px 32px rgba(0, 0, 0, 0.04),
    0 2px 16px rgba(0, 0, 0, 0.02),
    0 1px 4px rgba(0, 0, 0, 0.01);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;

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
    transform: translateY(-4px);
    box-shadow: 
      0 8px 40px rgba(0, 0, 0, 0.08),
      0 4px 20px rgba(0, 0, 0, 0.04),
      0 2px 8px rgba(0, 0, 0, 0.02);
    border-color: rgba(59, 130, 246, 0.2);
  }

  &:hover::before {
    opacity: 1;
  }

  /* Modern Grid Layout */
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  min-height: 140px;

  @media (max-width: 480px) {
    min-height: 120px;
    padding: 1.25rem;
    gap: 0.75rem;
  }
`;

const IconBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  grid-column: 2;
  grid-row: 1 / -1;
  padding-left: 1rem;

  @media (max-width: 480px) {
    padding-left: 0.75rem;
  }
`;

const Icon = styled.div<{ color: string }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${(props) => {
    switch (props.color) {
      case 'cyan':
        return 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(14, 165, 233, 0.15))';
      case 'emerald':
        return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.15))';
      case 'pink':
        return 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.15))';
      case 'purple':
        return 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.15))';
      default:
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.15))';
    }
  }};
  color: ${(props) => {
    switch (props.color) {
      case 'cyan':
        return '#0891b2';
      case 'emerald':
        return '#059669';
      case 'pink':
        return '#db2777';
      case 'purple':
        return '#7c3aed';
      default:
        return '#3b82f6';
    }
  }};
  border: 1px solid ${(props) => {
    switch (props.color) {
      case 'cyan':
        return 'rgba(6, 182, 212, 0.2)';
      case 'emerald':
        return 'rgba(16, 185, 129, 0.2)';
      case 'pink':
        return 'rgba(236, 72, 153, 0.2)';
      case 'purple':
        return 'rgba(139, 92, 246, 0.2)';
      default:
        return 'rgba(59, 130, 246, 0.2)';
    }
  }};
  font-size: 1.5rem;
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
    background: ${(props) => {
      switch (props.color) {
        case 'cyan':
          return 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(14, 165, 233, 0.1))';
        case 'emerald':
          return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))';
        case 'pink':
          return 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.1))';
        case 'purple':
          return 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))';
        default:
          return 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))';
      }
    }};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 4px 16px ${(props) => {
      switch (props.color) {
        case 'cyan':
          return 'rgba(6, 182, 212, 0.3)';
        case 'emerald':
          return 'rgba(16, 185, 129, 0.3)';
        case 'pink':
          return 'rgba(236, 72, 153, 0.3)';
        case 'purple':
          return 'rgba(139, 92, 246, 0.3)';
        default:
          return 'rgba(59, 130, 246, 0.3)';
      }
    }};
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
`;

const Title = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  grid-column: 1;
  grid-row: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const Value = styled.div`
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.1;
  color: #111827;
  margin: 0;
  grid-column: 1;
  grid-row: 2;
  display: flex;
  align-items: center;
  letter-spacing: -0.025em;

  @media (max-width: 480px) {
    font-size: 1.875rem;
  }
`;

const Description = styled.span`
  display: block;
  font-size: 0.6rem;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
  margin-top: 0.375rem;
  line-height: 1.2;
  letter-spacing: 0.05em;

  @media (max-width: 480px) {
    font-size: 0.55rem;
  }
`;

const ProgressBar = styled.div<{ color: string }>`
  width: 100%;
  height: 3px;
  background: rgba(229, 231, 235, 0.6);
  border-radius: 2px;
  overflow: hidden;
  grid-column: 1 / -1;
  grid-row: 3;
  margin-top: 0.5rem;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: 0%;
    background: ${(props) => {
      switch (props.color) {
        case 'cyan':
          return 'linear-gradient(90deg, #0891b2, #0e7490)';
        case 'emerald':
          return 'linear-gradient(90deg, #059669, #047857)';
        case 'pink':
          return 'linear-gradient(90deg, #db2777, #be185d)';
        case 'purple':
          return 'linear-gradient(90deg, #7c3aed, #6d28d9)';
        default:
          return 'linear-gradient(90deg, #3b82f6, #2563eb)';
      }
    }};
    border-radius: 2px;
    transition: width 1s ease-out;
    animation: progressAnimation 2s ease-out 0.5s forwards;
  }

  @keyframes progressAnimation {
    to {
      width: 75%;
    }
  }
`;

interface CardProps {
  color: string;
  icon: React.ReactNode;
  title: string | number;
  value: string | number;
  iconDetails: string;
}

export default function Card({
  color,
  icon,
  title,
  value,
  iconDetails,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.95, 1],
        duration: 400,
        easing: 'easeOutCubic',
        delay: utils.random(0, 200)
      });
    }
  }, []);

  return (
    <CardStyled ref={cardRef}>
      <Title>{title}</Title>
      <Value>{value}</Value>
      <IconBox>
        <Icon color={color}>{icon}</Icon>
        <Description>{iconDetails}</Description>
      </IconBox>
      <ProgressBar color={color} />
    </CardStyled>
  );
}
