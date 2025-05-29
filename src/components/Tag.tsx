import styled from "styled-components";

interface TagProps {
  type: string;
}

const Tag = styled.span<TagProps>`
  width: fit-content;
  text-align: center;
  font-weight: 600;

  // Dynamic status based on received prop
  color: var(--color-${(props) => props.type}-500);
`;

export default Tag;
