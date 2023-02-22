import { authService, storageService } from '@/firebase';
import { useRef, useState } from 'react';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { useMutation, useQueryClient } from 'react-query';
import { addData, visibleReset } from '@/api';
import Dropdown from '../mypage/Dropdown';
import styled from 'styled-components';
import MapLandingPage from '../detail/MapLandingPage';
import { v4 as uuidv4 } from 'uuid';
import { CustomButton } from '../common/CustomButton';
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
    reader.readAsDataURL(theFile);
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
      <StPostFormWrap>
        <MapLandingPage
          searchCategory={searchCategory}
          saveLatLng={saveLatLng}
          setSaveLatLng={setSaveLatLng}
          saveAddress={saveAddress}
          setSaveAddress={setSaveAddress}
          setPlace={setPlace}
          place={place}
        />

        <StPostFormContent>
          <h4>내 스팟 추가하기</h4>
          <StPostFormContentWrap>
            <div
              style={{ display: 'flex', width: 'auto', flexDirection: 'row' }}
            >
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
            </div>
            <StPostFormContentTop>
              <StPostFormContentName>사진정보</StPostFormContentName>
              <div>
                <StPostFormSelect>
                  <option value="제주시">제주시</option>
                  <option value="서귀포시">서귀포시</option>
                </StPostFormSelect>
                <StPostFormSelect>
                  <option value="구좌읍">구좌읍</option>
                  <option value="표선면">표선면</option>
                  <option value="대정읍">대정읍</option>
                  <option value="애월읍">애월읍</option>
                  <option value="남원읍">남원읍</option>
                  <option value="성산읍">성산읍</option>
                  <option value="안덕면">안덕면</option>
                  <option value="우도면">우도면</option>
                  <option value="추자면">추자면</option>
                  <option value="한경면">한경면</option>
                  <option value="한림읍">한림읍</option>
                  <option value="조천읍">조천읍</option>
                </StPostFormSelect>
              </div>
              <div>
                <CustomButton
                  width="116px"
                  backgroundColor="white"
                  color="#1882FF"
                  border="1px solid #1882FF"
                  height="38px"
                >
                  이미지 회전
                </CustomButton>
                <CustomButton
                  width="116px"
                  backgroundColor="white"
                  color="#1882FF"
                  border="1px solid #1882FF"
                  height="38px"
                >
                  다시 등록하기
                </CustomButton>
              </div>
            </StPostFormContentTop>

            {/* <CustomButton
              borderRadius="5px"
              onClick={(e) => setDropdownVisibility(!dropdownVisibility)}
            >
              {dropdownVisibility ? '닫기' : '열기'}
            </CustomButton>
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
            </Dropdown> */}
          </StPostFormContentWrap>
          {/* <div>
            <h4>카테고리를 골라주세요</h4>
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
          </div> */}
          <StPostFormInputWrap>
            <StPostFormInputTitle>제목</StPostFormInputTitle>
            <StPostFormInput
              placeholder="사진을 소개하는 제목을 적어주세요!"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <StPostFormInputTitle>내용</StPostFormInputTitle>
            <StPostFormInput
              placeholder="사진의 구도, 촬영장소로 가는 방법, 촬영시간 등 꿀팁을 적어주세요.!"
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </StPostFormInputWrap>
          <CustomButton
            width="100%"
            height="48px"
            margin="0px"
            border="none"
            backgroundColor="#1882FF"
            onClick={onClickAddData}
            // border="0px"
          >
            업로드하기
          </CustomButton>
        </StPostFormContent>
      </StPostFormWrap>
    </>
  );
};

export default PostForm;

const StPostFormWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`;
const StPostFormContent = styled.div`
  /* background-color: beige; */
  height: 280px;
  width: 400px;
  margin-top: -250px;
  padding: 10px;
`;

const StPostFormContentWrap = styled.div`
  /* background-color: green; */
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StPostFormContentTop = styled.div`
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StPostFormContentName = styled.span`
  font-weight: 500;
  margin-right: 170px;
  padding: 5px 0px;
  font-size: 20px;
`;

const StPostFormInputWrap = styled.div`
  margin-top: 15px;
`;
const StPostFormInput = styled.input`
  width: 100%;
  height: 30px;
  border: none;
  background-color: #f8f8f8;
  border-bottom: 1px solid blue;
  margin-bottom: 15px;
`;
const StPostFormInputTitle = styled.p`
  font-size: 20px;
  font-weight: 700;
`;

const StPostFormSelect = styled.select`
  font-size: 16px;
  font-weight: 400;
  height: 30px;
  width: 90px;
  border-radius: 52px;
  text-align: center;
  margin: 5px 30px 10px 1px;
  background-color: #e7e7e7;
`;

const Img = styled.label`
  height: 100px;
  width: 100px;
  background-image: url(/plusimage.png);
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
