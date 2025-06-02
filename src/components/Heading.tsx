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
    font-size: 0.75rem;
    line-height: 1.2;
  `,
  sm: css`
    font-size: 0.875rem;
    line-height: 1.25;
  `,
  base: css`
    font-size: 1rem;
    line-height: 1.5;
  `,
  lg: css`
    font-size: 1.125rem;
    line-height: 1.4;
  `,
  xl: css`
    font-size: 1.25rem;
    line-height: 1.3;
  `,
  "2xl": css`
    font-size: 1.5rem;
    line-height: 1.2;
  `,
  "3xl": css`
    font-size: 1.875rem;
    line-height: 1.1;
  `,
  "4xl": css`
    font-size: 2.25rem;
    line-height: 1.1;
  `,
};

const weightStyles = {
  normal: css`
    font-weight: 400;
  `,
  medium: css`
    font-weight: 500;
  `,
  semibold: css`
    font-weight: 600;
  `,
  bold: css`
    font-weight: 700;
  `,
  extrabold: css`
    font-weight: 800;
  `,
};

const colorStyles = {
  primary: css`
    color: #111827;
  `,
  secondary: css`
    color: #374151;
  `,
  muted: css`
    color: #6b7280;
  `,
  brand: css`
    color: #3b82f6;
  `,
  success: css`
    color: #059669;
  `,
  warning: css`
    color: #d97706;
  `,
  danger: css`
    color: #dc2626;
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
    letter-spacing: 0;
  `,
  relaxed: css`
    letter-spacing: 0.05em;
  `,
};

const defaultSizesByTag = {
  h1: "2xl",
  h2: "xl",
  h3: "lg",
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  
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
    const spacing = props.spacing || "tight";
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
