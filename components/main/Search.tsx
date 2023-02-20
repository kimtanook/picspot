import { ChangeEventHandler, RefObject } from 'react';

const Search = ({
  searchOptionRef,
  searchValue,
  onChangeSearchValue,
}: {
  searchOptionRef: RefObject<HTMLSelectElement>;
  searchValue: string;
  onChangeSearchValue: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div>
      <select ref={searchOptionRef}>
        <option value="userName">닉네임</option>
        <option value="title">제목</option>
      </select>
      <input
        value={searchValue}
        onChange={onChangeSearchValue}
        placeholder="검색으로 사진을 둘러보세요!"
      />
    </div>
  );
};
export default Search;
