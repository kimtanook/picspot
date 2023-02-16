import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';

const Search = ({
  searchValue,
  onChangeSearchOption,
  onChangeSearchValue,
}: {
  searchValue: string;
  onChangeSearchOption: ChangeEventHandler<HTMLSelectElement>;
  onChangeSearchValue: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div>
      <select onChange={onChangeSearchOption}>
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
