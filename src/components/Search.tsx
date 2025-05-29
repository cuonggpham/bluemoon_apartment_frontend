import styled from "styled-components";
import { HiOutlineSearch } from "react-icons/hi";
import { ChangeEvent, useEffect, useState } from "react";

const SearchStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--border-radius-xl);
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  max-width: 280px;

  &:hover {
    border-color: var(--color-brand-300);
    box-shadow: var(--shadow-md);
  }

  &:focus-within {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const SearchIcon = styled(HiOutlineSearch)`
  color: var(--color-grey-500);
  font-size: var(--font-size-base);
  transition: color var(--transition-fast);

  ${SearchStyled}:hover & {
    color: var(--color-brand-500);
  }
`;

const Input = styled.input`
  color: var(--color-grey-900);
  width: 160px;
  border: none;
  outline: none;
  transition: all var(--transition-normal);
  background-color: transparent;
  font-size: var(--font-size-sm);
  font-weight: 400;
  
  &::placeholder {
    color: var(--color-grey-400);
    font-size: var(--font-size-sm);
  }

  &:focus {
    width: 200px;
    color: var(--color-grey-900);
  }
`;


interface SearchProps {
  setKeyword: (keyword: string) => void;
  keyword: string
}


export default function Search({setKeyword, keyword}: SearchProps) {
  const handleChangeSearchBar = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }

  return (
    
    <SearchStyled>
      <SearchIcon />
      <Input placeholder="Search..." value={keyword} onChange={handleChangeSearchBar}/>
    </SearchStyled>
  );
}
