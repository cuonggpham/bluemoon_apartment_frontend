import styled, { css } from "styled-components";

// Enhanced modern sizes with Apple-inspired styling
const sizes = {
  compact: css`
    font-size: 1rem; /* 16px - increased from 14px */
    padding: 0.5rem 1rem; /* 8px 16px - increased from 6px 12px */
    text-align: center;
    font-weight: 500;
    border-radius: var(--border-radius-md);
    min-height: 36px; /* increased from 32px */
    letter-spacing: -0.01em;
  `,

  small: css`
    font-size: 1.125rem; /* 18px - increased from 16px */
    padding: var(--space-3) var(--space-5); /* increased padding */
    text-align: center;
    font-weight: 500;
    border-radius: var(--border-radius-lg);
    min-height: 40px; /* increased from 36px */
    letter-spacing: -0.01em;
  `,

  medium: css`
    font-size: 1.25rem; /* 20px - increased from 18px */
    padding: var(--space-4) var(--space-7); /* increased padding */
    text-align: center;
    border-radius: var(--border-radius-xl);
    font-weight: 500;
    min-height: 48px; /* increased from 44px */
    letter-spacing: -0.01em;
  `,

  large: css`
    font-size: 1.375rem; /* 22px - increased font size */
    padding: var(--space-5) var(--space-9); /* increased padding */
    text-align: center;
    border-radius: var(--border-radius-xl);
    font-weight: 500;
    min-height: 56px; /* increased from 52px */
    letter-spacing: -0.01em;
  `,
};

// Enhanced modern variations with premium styling
const variations = {
  primary: css`
    color: var(--color-grey-0);
    background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600));
    border: 1px solid transparent;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--color-brand-400), var(--color-brand-500));
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
      
      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }

    &:disabled {
      background: var(--color-grey-300);
      color: var(--color-grey-500);
      transform: none;
      box-shadow: none;
      
      &::before {
        display: none;
      }
    }
  `,

  secondary: css`
    color: var(--color-grey-800);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);
    box-shadow: var(--shadow-xs);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--color-grey-50);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-grey-300);
      
      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-xs);
    }

    &:disabled {
      background: var(--color-grey-100);
      color: var(--color-grey-400);
      transform: none;
      box-shadow: none;
    }
  `,

  outline: css`
    color: var(--color-brand-600);
    background: transparent;
    border: 1px solid var(--color-brand-300);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--color-brand-50);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover {
      transform: translateY(-1px);
      border-color: var(--color-brand-500);
      box-shadow: var(--shadow-sm);
      
      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }

    &:disabled {
      color: var(--color-grey-400);
      border-color: var(--color-grey-200);
      transform: none;
    }
  `,

  ghost: css`
    color: var(--color-grey-700);
    background: transparent;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--color-grey-100);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover {
      color: var(--color-grey-900);
      
      &::before {
        opacity: 1;
      }
    }

    &:disabled {
      color: var(--color-grey-400);
    }
  `,

  success: css`
    color: var(--color-grey-0);
    background: linear-gradient(135deg, var(--color-green-500), var(--color-green-600));
    border: 1px solid transparent;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--color-green-400), var(--color-green-500));
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
      
      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `,

  warning: css`
    color: var(--color-grey-0);
    background: linear-gradient(135deg, var(--color-orange-500), var(--color-orange-600));
    border: 1px solid transparent;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--color-orange-400), var(--color-orange-500));
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
      
      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `,

  danger: css`
    color: var(--color-grey-0);
    background: linear-gradient(135deg, var(--color-red-500), var(--color-red-600));
    border: 1px solid transparent;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--color-red-400), var(--color-red-500));
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
      
      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `,
};

// Define types for the Button props
interface ButtonProps {
  size?: "compact" | "small" | "medium" | "large";
  variation?: "primary" | "secondary" | "outline" | "ghost" | "success" | "warning" | "danger";
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
  z-index: 1;
  
  /* Focus styles */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-brand-500);
  }
  
  /* Full width option */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
  }
  
  ${(props) => sizes[props.size || "medium"]};
  ${(props) => variations[props.variation || "primary"]};
`;

Button.defaultProps = {
  variation: "primary",
  size: "medium",
  fullWidth: false,
  disabled: false,
};

export default Button;
