import { authService, storageService } from '@/firebase';
import { useRef, useState } from 'react';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { useMutation, useQueryClient } from 'react-query';
import { addData, visibleReset } from '@/api';
import Dropdown from '../mypage/Dropdown';
import styled from 'styled-components';
import MapLandingPage from '../detail/MapLandingPage';
import { v4 as uuidv4 } from 'uuid';

const PostForm = ({ setOpenModal }: any) => {
  const queryClient = useQueryClient();

  const [saveLatLng, setSaveLatLng]: any = useState([]);
  const [saveAddress, setSaveAddress]: any = useState();

  //* category 클릭, 검색 시 map이동에 관한 통합 state
  const [searchCategory, setSearchCategory]: any = useState('');

  const fileInput: any = useRef();

  //* 드롭다운 상태
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUpload, setImageUpload]: any = useState(null);
  const nickname = authService?.currentUser?.displayName;

  let postState: any = {
    title: title,
    content: content,
    imgUrl: '',
    createdAt: Date.now(),
    creator: authService.currentUser?.uid,
    city: city,
    town: town,
    clickCounter: 0,
    lat: saveLatLng.Ma,
    long: saveLatLng.La,
    address: saveAddress,
    nickname: nickname,
  };

  // console.log('imgUpload: ', imageUpload);

  //* useMutation 사용해서 포스트 추가하기
  const { mutate: onAddData } = useMutation(addData);

  //* image 업로드 후 화면 표시 함수
  const handleImageChange = (e: any) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader?.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      }: any = finishedEvent;
      setImageUpload(result);
    };
  };

  // console.log('imgUpload: ', imageUpload);

  //* 추가버튼 눌렀을때 실행하는 함수
  const onClickAddData = async () => {
    if (imageUpload === null) {
      alert('이미지를 추가해주세요.');
      return;
    }

    if (title === '') {
      alert('제목을 입력해주세요');
      return;
    }

    if (content === '') {
      alert('내용을 입력해주세요');
      return;
    }

    if (city === '' || town === '') {
      alert('카테고리를 입력해주세요');
      return;
    }

    if (saveLatLng === undefined || saveAddress === undefined) {
      alert('지도에 마커를 찍어주세요');
      return;
    }

    const imageRef = ref(storageService, `images/${uuidv4()}`);
    console.log('imageRef: ', imageRef);
    uploadString(imageRef, imageUpload, 'data_url').then((response) => {
      getDownloadURL(response.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        const response = url;
        postState = {
          ...postState,
          imgUrl: response,
        };
        onAddData(postState, {
          onSuccess: () => {
            console.log('포스트 추가 요청 성공');
            queryClient.invalidateQueries('infiniteData');
            setOpenModal(false);
          },
          onError: () => {
            console.log('포스트 추가 요청 실패');
          },
        });
      });
    });
    visibleReset();
  };

  //* 카테고리버튼 눌렀을 때 실행하는 함수
  const [place, setPlace] = useState('');
  const onClickTown = (e: any) => {
    setPlace('');
    setTown(e.target.innerText);
    setSearchCategory(e.target.innerText);
  };

  return (
    <>
      <StAddButton onClick={onClickAddData}>추가</StAddButton>
      <div style={{ display: 'flex', width: 'auto', flexDirection: 'row' }}>
        <Img>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
            src={imageUpload}
            ref={fileInput}
            alt="image"
            id="file"
            style={{
              height: '100%',
              width: '100%',
              display: 'none',
            }}
          />
          {imageUpload && <SpotImg src={imageUpload} />}
        </Img>
        <p>
          제목:
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </p>
        <p>
          내용:
          <input
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </p>
      </div>

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
      <MapLandingPage
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

const StAddButton = styled.button`
  color: red;
`;

const Img = styled.label`
  height: 100px;
  width: 100px;
  background-image: url(/Light.png);
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
