import { authService, storageService } from '@/firebase';
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMutation } from 'react-query';
import { addData } from '@/api';
import Dropdown from '../mypage/Dropdown';
import SearchPlace from '../detail/SearchPlace';

//! postState 타입 해결
//! imageUpload 타입 해결
const PostForm = () => {
  const [saveLatLng, setSaveLatLng]: any = useState([]);
  const [saveAddress, setSaveAddress]: any = useState();

  //! category 클릭, 검색 시 map이동에 관한 통합 state
  const [searchCategory, setSearchCategory]: any = useState('');

  //* 드롭다운 상태
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [city, setCity] = useState('');
  console.log('city: ', city);
  const [town, setTown] = useState('');
  console.log('town: ', town);
  const [title, setTitle] = useState('');
  const [imageUpload, setImageUpload]: any = useState(null);
  console.log('주소테스트다임마', saveLatLng);
  console.log('주소테스트다임마', saveAddress);
  let postState: any = {
    title: title,
    imgUrl: '',
    createdAt: Date.now(),
    creator: authService.currentUser?.uid,
    city: city,
    town: town,
    clickCounter: 0,
    lat: saveLatLng.La,
    long: saveLatLng.Ma,
    address: saveAddress,
  };

  //* useMutation 사용해서 데이터 추가하기
  const { mutate: onAddData } = useMutation(addData);

  //* 추가버튼 눌렀을때 실행하는 함수
  const onClickAddData = async () => {
    if (imageUpload === null) {
      alert('이미지를 추가해주세요.');
      return;
    }
    const imageRef = ref(storageService, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        console.log('url: ', url);
        const response = url;
        postState = {
          ...postState,
          imgUrl: response,
        };
        onAddData(postState, {
          onSuccess: () => {
            console.log('추가 요청 성공');
          },
          onError: () => {
            console.log('추가 요청 실패');
          },
        });
      });
    });
  };

  const [place, setPlace] = useState('');

  const onClickTown = (e: any) => {
    setTown(e.target.innerText);
    setPlace('');
    setSearchCategory(e.target.innerText);
  };

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(event: any) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <input
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <button onClick={onClickAddData}>추가</button>

      <div>
        <h3>여행갈 지역을 골라주세요</h3>
        <button onClick={(e) => setDropdownVisibility(!dropdownVisibility)}>
          {dropdownVisibility ? '닫기' : '열기'}
        </button>
        <Dropdown visibility={dropdownVisibility}>
          <ul>
            <li style={{ listStyle: 'none' }}>
              <input
                type="radio"
                id="제주도"
                name="제주도"
                value="제주도"
                checked={city === '제주도' ? true : false}
                onChange={(e) => setCity(e.target.value)}
              />
              제주도
            </li>
            <li style={{ listStyle: 'none' }}>
              <input
                type="radio"
                id="제주시"
                name="제주시"
                value="제주시"
                checked={city === '제주시' ? true : false}
                onChange={(e) => setCity(e.target.value)}
              />
              제주시
            </li>
            <li style={{ listStyle: 'none' }}>
              <input
                type="radio"
                id="서귀포시"
                name="서귀포시"
                value="서귀포시"
                checked={city === '서귀포시' ? true : false}
                onChange={(e) => setCity(e.target.value)}
              />
              서귀포시
            </li>
          </ul>
        </Dropdown>
      </div>

      <div>
        <h3>카테고리를 골라주세요</h3>
        <button onClick={onClickTown}>조천읍</button>
        <button onClick={onClickTown}>제주시</button>
        <button onClick={onClickTown}>성산읍</button>
        <button onClick={onClickTown}>표선면</button>
        <button onClick={onClickTown}>남원읍</button>
        <button onClick={onClickTown}>서귀포</button>
        <button onClick={onClickTown}>중문</button>
        <button onClick={onClickTown}>안덕면</button>
        <button onClick={onClickTown}>대정읍</button>
        <button onClick={onClickTown}>애월읍</button>
        <button onClick={onClickTown}>우도</button>
        <button onClick={onClickTown}>마라도</button>
      </div>
      <SearchPlace
        searchCategory={searchCategory}
        saveLatLng={saveLatLng}
        setSaveLatLng={setSaveLatLng}
        saveAddress={saveAddress}
        setSaveAddress={setSaveAddress}
        setPlace={setPlace}
        place={place}
      />
    </>
  );
};

export default PostForm;
