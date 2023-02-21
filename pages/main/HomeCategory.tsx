import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { visibleReset } from '@/api';
import { useRouter } from 'next/router';



const HomeCategory = () => {
//   const [searchOption, setSearchOption] = useState('userName');
//   const [searchValue, setSearchValue] = useState('');
//   const [selectCity, setSelectCity] = useState('');
//   const [selectTown, setSelectTown] = useState('');
//   const router = useRouter();


//     // [검색] 유저가 고르는 옵션(카테고리)과, 옵션을 고른 후 입력하는 input
//     const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
//       setSelectCity('제주전체');
//       setSelectTown('');
//       visibleReset();
//       setSearchOption(searchOptionRef.current?.value);
//       setSearchValue(event.target.value);
//       router.push({
//         pathname: '/main',
//         query: { city: '제주전체' },
//       });
//     };
//     console.log('searchValue : ', searchValue);
//     // [카테고리] 지역 카테고리 onChange
//     const onChangeSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
//       setSelectTown('');
//       setSearchValue('');
//       visibleReset();
//       router.push({
//         pathname: '/main',
//         query: { city: event.target.value },
//       });
//       setSelectCity(event.target.value);
//     };
//     // [카테고리] 타운 카테고리 onChange
//     const onChangeSelectTown = (event: ChangeEvent<HTMLSelectElement>) => {
//       setSearchValue('');
//       visibleReset();
//       setSelectTown(event.target.value);
//     };
//   return (
//     <div>
//       <div>HomeCategory component</div>
//     </div>
//   );
// };
export default HomeCategory;
