import styled from "styled-components";

const CardStyled = styled.div`
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-grey-300);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-brand-500), var(--color-brand-400));
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  &:hover::before {
    opacity: 1;
  }

  /* Compact Grid Layout */
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  gap: 0.75rem;
  min-height: 110px;

  @media (max-width: 480px) {
    min-height: 100px;
    padding: 1rem;
    gap: 0.5rem;
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
  padding-left: 0.75rem;

  @media (max-width: 480px) {
    padding-left: 0.5rem;
  }
`;

const Icon = styled.div<{ color: string }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  background: linear-gradient(135deg, var(--color-${(props) => props.color}-100), var(--color-${(props) => props.color}-200));
  color: var(--color-${(props) => props.color}-600);
  font-size: 1.25rem;
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-fast);

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-sm);
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const Title = styled.p`
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-grey-600);
  margin: 0;
  grid-column: 1;
  grid-row: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const Value = styled.div`
  font-size: 1.75rem;
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-tight);
  color: var(--color-grey-900);
  margin: 0;
  grid-column: 1;
  grid-row: 2;
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.span`
  display: block;
  font-size: 0.625rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-grey-500);
  text-align: center;
  margin-top: 0.25rem;
  line-height: var(--line-height-tight);

  @media (max-width: 480px) {
    font-size: 0.6rem;
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
  return (
    <CardStyled>
      <Title>{title}</Title>
      <Value>{value}</Value>
      <IconBox>
        <Icon color={color}>{icon}</Icon>
        <Description>{iconDetails}</Description>
      </IconBox>
    </CardStyled>
  );
}
