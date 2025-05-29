import styled, { css } from "styled-components";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  color?: "primary" | "secondary" | "muted" | "brand" | "success" | "warning" | "danger";
  align?: "left" | "center" | "right";
  spacing?: "tight" | "normal" | "relaxed";
}

const sizeStyles = {
  xs: css`
    font-size: var(--font-size-xs);
    line-height: var(--line-height-tight);
  `,
  sm: css`
    font-size: var(--font-size-sm);
    line-height: var(--line-height-tight);
  `,
  base: css`
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
  `,
  lg: css`
    font-size: var(--font-size-lg);
    line-height: var(--line-height-normal);
  `,
  xl: css`
    font-size: var(--font-size-xl);
    line-height: var(--line-height-tight);
  `,
  "2xl": css`
    font-size: var(--font-size-2xl);
    line-height: var(--line-height-tight);
  `,
  "3xl": css`
    font-size: var(--font-size-3xl);
    line-height: var(--line-height-tight);
  `,
  "4xl": css`
    font-size: var(--font-size-4xl);
    line-height: var(--line-height-tight);
  `,
};

const weightStyles = {
  normal: css`
    font-weight: var(--font-weight-normal);
  `,
  medium: css`
    font-weight: var(--font-weight-medium);
  `,
  semibold: css`
    font-weight: var(--font-weight-semibold);
  `,
  bold: css`
    font-weight: var(--font-weight-bold);
  `,
  extrabold: css`
    font-weight: var(--font-weight-extrabold);
  `,
};

const colorStyles = {
  primary: css`
    color: var(--color-grey-900);
  `,
  secondary: css`
    color: var(--color-grey-700);
  `,
  muted: css`
    color: var(--color-grey-500);
  `,
  brand: css`
    color: var(--color-brand-600);
  `,
  success: css`
    color: var(--color-green-600);
  `,
  warning: css`
    color: var(--color-orange-600);
  `,
  danger: css`
    color: var(--color-red-600);
  `,
};

const alignStyles = {
  left: css`
    text-align: left;
  `,
  center: css`
    text-align: center;
  `,
  right: css`
    text-align: right;
  `,
};

const spacingStyles = {
  tight: css`
    letter-spacing: -0.025em;
  `,
  normal: css`
    letter-spacing: -0.01em;
  `,
  relaxed: css`
    letter-spacing: 0;
  `,
};

const defaultSizesByTag = {
  h1: "2xl",
  h2: "lg",
  h3: "base",
  h4: "base",
  h5: "sm",
  h6: "xs",
} as const;

const defaultWeightsByTag = {
  h1: "bold",
  h2: "semibold",
  h3: "semibold",
  h4: "medium",
  h5: "medium",
  h6: "medium",
} as const;

const Heading = styled.h1.withConfig({
  shouldForwardProp: (prop) => !['size', 'weight', 'color', 'align', 'spacing'].includes(prop),
})<HeadingProps>`
  margin: 0;
  padding: 0;
  font-family: var(--font-family-sans);
  
  /* Apply size styles */
  ${(props) => {
    const tag = props.as || "h1";
    const size = props.size || defaultSizesByTag[tag] || "base";
    return sizeStyles[size];
  }}
  
  /* Apply weight styles */
  ${(props) => {
    const tag = props.as || "h1";
    const weight = props.weight || defaultWeightsByTag[tag] || "semibold";
    return weightStyles[weight];
  }}
  
  /* Apply color styles */
  ${(props) => {
    const color = props.color || "primary";
    return colorStyles[color];
  }}
  
  /* Apply alignment styles */
  ${(props) => {
    const align = props.align || "left";
    return alignStyles[align];
  }}
  
  /* Apply spacing styles */
  ${(props) => {
    const spacing = props.spacing || "normal";
    return spacingStyles[spacing];
  }}
  
  /* Remove default browser styling */
  font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    font-size: 90%;
  }

  @media (max-width: 480px) {
    font-size: 85%;
  }
`;

export default Heading;
