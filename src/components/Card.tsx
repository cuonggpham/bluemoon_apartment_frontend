import styled from "styled-components";

const CardStyled = styled.div`
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-grey-300);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-brand-500), var(--color-brand-400));
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  &:hover::before {
    opacity: 1;
  }

  /* Modern Grid Layout */
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-4);
  min-height: 140px;
`;

const IconBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  grid-column: 2;
  grid-row: 1 / -1;
  padding-left: var(--space-4);
`;

const Icon = styled.div<{ color: string }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-xl);
  background: linear-gradient(135deg, var(--color-${(props) => props.color}-100), var(--color-${(props) => props.color}-200));
  color: var(--color-${(props) => props.color}-600);
  font-size: var(--font-size-xl);
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-fast);

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-sm);
  }
`;

const Title = styled.p`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-grey-600);
  margin: 0;
  grid-column: 1;
  grid-row: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Value = styled.div`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-tight);
  color: var(--color-grey-900);
  margin: 0;
  grid-column: 1;
  grid-row: 2;
  display: flex;
  align-items: center;
`;

const Description = styled.span`
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-grey-500);
  text-align: center;
  margin-top: var(--space-1);
  line-height: var(--line-height-tight);
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
