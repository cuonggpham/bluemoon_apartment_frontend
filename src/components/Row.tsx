import styled, { css } from "styled-components";

interface RowProps {
  type?: "horizontal" | "vertical";
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

const gapSizes = {
  xs: "var(--space-1)",
  sm: "var(--space-2)",
  md: "var(--space-4)",
  lg: "var(--space-6)",
  xl: "var(--space-8)",
  "2xl": "var(--space-12)",
};

const alignItems = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

const justifyContent = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

const Row = styled.div<RowProps>`
  display: flex;
  gap: ${(props) => gapSizes[props.gap || "md"]};
  align-items: ${(props) => alignItems[props.align || "center"]};
  justify-content: ${(props) => justifyContent[props.justify || (props.type === "horizontal" ? "between" : "start")]};
  flex-wrap: ${(props) => props.wrap ? "wrap" : "nowrap"};
  
  ${(props) =>
    props.type === "horizontal" &&
    css`
      flex-direction: row;
    `}
    
  ${(props) =>
    props.type === "vertical" &&
    css`
      flex-direction: column;
      align-items: ${alignItems[props.align || "stretch"]};
    `}
`;

Row.defaultProps = {
  type: "vertical",
  gap: "md",
  align: "center",
  justify: "start",
  wrap: false,
};

export default Row;
