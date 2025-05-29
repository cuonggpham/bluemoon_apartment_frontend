import Search from "./Search";
import styled from "styled-components";
import Add from "./Add";

const AddAndSearchStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
`;

export default function AddAndSearch({ children, title, setKeyword, keyword }) {
  return (
    <AddAndSearchStyled>
      <Add title={title}>{children}</Add>
      <Search setKeyword={setKeyword} keyword={keyword}/>
    </AddAndSearchStyled>
  );
}
