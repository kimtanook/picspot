import { authService, storageService } from '@/firebase';
import { useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMutation } from 'react-query';
import { addData } from '@/api';
import Dropdown from '../mypage/Dropdown';

import styled from 'styled-components';

//! postState 타입 해결
//! imageUpload 타입 해결
const PostForm = () => {
  //* 위도,경도에 대한 state
  const [saveLatLng, setSaveLatLng]: any = useState([]);
  const [saveAddress, setSaveAddress]: any = useState();
  //* category 클릭, 검색 시 map이동에 관한 통합 state
  const [searchCategory, setSearchCategory]: any = useState('');
  //* 이미지 업로드에 대한 state
  const [attachment, setAttachment]: any = useState();
  const [url, setUrl]: any = useState(null);
  const fileInput: any = useRef();
  const [imageUpload, setImageUpload]: any = useState(null);
  //* 드롭다운 상태
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  //* 지역 카테고리 state
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [place, setPlace] = useState('');
  //* 제목 및 내용 state
  const [title, setTitle] = useState([]);
  //* 추가되는 data
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
    // if (imageUpload === null) {
    //   alert('이미지를 추가해주세요.');
    //   return;
    // }
    const imageRef = ref(storageService, `images/${imageUpload.name}`);
    uploadBytes(imageRef, url).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
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

  //*이미지 업로드 후 화면 표시
  const handleImageChange = (e: any) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      }: any = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  //* 이미지 다시 설정 = 취소
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };
  //* town 클릭 함수
  const onClickTown = (e: any) => {
    setTown(e.target.innerText);
    setPlace('');
    setSearchCategory(e.target.innerText);
  };

  return (
    <>
      <div style={{ display: 'inline-flex', width: '100%' }}>
        <Img htmlFor="file">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            // onChange={(event: any) => {
            //   setImageUpload(event.target.files[0]);
            // }}
            onChange={handleImageChange}
            id="file"
            src={imageUpload}
            ref={fileInput}
            style={{
              height: '100%',
              width: '100%',
              // display: 'none',
            }}
          />
          {attachment && <SpotImg src={attachment} />}
        </Img>
        <ImgCancleBtn onClick={onClearAttachment}> X </ImgCancleBtn>
        <input
          onChange={(e: any) => {
            setTitle(e.target.value);
          }}
        />
        <button onClick={onClickAddData}>추가</button>
      </div>
      <div style={{ display: 'flex' }}>
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

const Img = styled.label`
  height: 100px;
  width: 100px;
  background-color: tomato;
  background-position: center;
  cursor: pointer;
  margin: 10px;
`;

const SpotImg = styled.img`
  height: 100%;
  width: 100%;
  align-items: center;
  object-fit: contain;
`;

const ImgCancleBtn = styled.button`
  color: black;
  font-size: 18px;
  cursor: pointer;
`;
