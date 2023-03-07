import { ChangeEventHandler, RefObject } from 'react';
import styled from 'styled-components';

const Search = ({
  searchOptionRef,
  searchValue,
  onChangeSearchValue,
}: {
  searchOptionRef: RefObject<HTMLSelectElement> | undefined;
  searchValue: string | undefined;
  onChangeSearchValue: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <SearchWrap>
      <SearchImage src="/search.svg" alt="search-Image" />
      <Select ref={searchOptionRef}>
        <option value="address">주소</option>
        <option value="title">제목</option>
      </Select>
      <SearchInput
        value={searchValue}
        onChange={onChangeSearchValue}
        placeholder="검색으로 사진을 둘러보세요!"
      />
    </SearchWrap>
  );
};
export default Search;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  height: 20px;
  width: 24px;
  margin-right: 4px;
  transition: 1s;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
  :hover {
    width: 300px;
    transition: 1s;
  }
`;
const Select = styled.select`
  border: none;
  border-radius: 10px;
  margin-right: 5px;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const SearchInput = styled.input`
  padding-left: 28px;
  border: none;
  border-radius: 10px;
  margin-right: 5px;
  width: 200px;
  :focus {
    width: 300px;
    transition: 1s;
  }
`;
const SearchImage = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 10px;
  margin-left: 5px;
`;
