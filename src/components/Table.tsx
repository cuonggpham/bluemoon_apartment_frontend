import styled, { css } from "styled-components";
import React, {
  createContext,
  useContext,
  ReactNode,
  ReactElement,
} from "react";

type CommonRowProps = {
  columns?: string;
  size?: "small" | "normal";
};

type TableProps = {
  columns: string;
  children: ReactNode;
};

type HeaderProps = {
  size?: "small" | "normal";
  children: ReactNode;
};

type RowProps = {
  size?: "small" | "normal";
  children: ReactNode;
};

type BodyProps<T> = {
  data: T[];
  render: (item: T, index: number) => ReactElement;
};

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-xl);
  font-size: var(--font-size-base);
  background-color: var(--color-grey-0);
  overflow: hidden;
  text-align: left;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
  margin-top: 60px;  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const CommonRow = styled.div<CommonRowProps>`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: var(--space-6);
  align-items: center;
  transition: background-color var(--transition-fast);
`;

const StyledHeader = styled(CommonRow)<CommonRowProps>`
  ${(props) =>
    props.size === "small" &&
    css`
      padding: var(--space-2) var(--space-6);
    `}

  ${(props) =>
    props.size === "normal" &&
    css`
      padding: var(--space-4) var(--space-6);
    `}
  background: linear-gradient(135deg, var(--color-grey-800), var(--color-grey-900));
  border-bottom: 1px solid var(--color-grey-700);
  letter-spacing: 0.025em;
  font-weight: var(--font-weight-semibold);
  color: var(--color-grey-0);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  border-top-right-radius: var(--border-radius-xl);
  border-top-left-radius: var(--border-radius-xl);
`;

StyledHeader.defaultProps = {
  size: "normal",
};

const StyledRow = styled(CommonRow)<CommonRowProps>`
  ${(props) =>
    props.size === "small" &&
    css`
      padding: var(--space-2) var(--space-6);
    `}

  ${(props) =>
    props.size === "normal" &&
    css`
      padding: var(--space-4) var(--space-6);
    `}

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
  
  &:hover {
    background-color: var(--color-grey-50);
  }
  
  &:nth-child(even) {
    background-color: var(--color-grey-25);
    
    &:hover {
      background-color: var(--color-grey-75);
    }
  }
`;

StyledRow.defaultProps = {
  size: "normal",
};

const StyledBody = styled.section`
  /* No margin needed with modern design */
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  color: var(--color-grey-700);
  border-top: 1px solid var(--color-grey-200);
  border-bottom-right-radius: var(--border-radius-xl);
  border-bottom-left-radius: var(--border-radius-xl);
  display: flex;
  justify-content: center;
  padding: var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);

  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  text-align: center;
  margin: var(--space-12) var(--space-6);
  color: var(--color-grey-500);
  
  &::before {
    content: "📋";
    display: block;
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-4);
    opacity: 0.5;
  }
`;

const TableContext = createContext<{ columns?: string }>({});

export default function Table({ columns, children }: TableProps) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table" as="header">
        {children}
      </StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children, size }: HeaderProps) {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader role="row" columns={columns} size={size}>
      {children}
    </StyledHeader>
  );
}

function Row({ children, size }: RowProps) {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" columns={columns} size={size}>
      {children}
    </StyledRow>
  );
}

function Body<T>({ data, render }: BodyProps<T>) {
  if (!data.length) return <Empty>No data at the moment</Empty>;
  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;
