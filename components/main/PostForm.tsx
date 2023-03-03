import { authService, storageService } from '@/firebase';
import { useRef, useState } from 'react';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { useMutation, useQueryClient } from 'react-query';
import { addData, visibleReset } from '@/api';
import styled from 'styled-components';
import MapLandingPage from '../detail/MapLandingPage';
import { v4 as uuidv4 } from 'uuid';
import { CustomButton } from '../common/CustomButton';
import { customAlert, customConfirm } from '@/utils/alerts';
const PostForm = ({ setIsModalPostActive, modal }: any) => {
  const queryClient = useQueryClient();

  const [saveLatLng, setSaveLatLng]: any = useState([]);
  const [saveAddress, setSaveAddress]: any = useState();

  //* category 클릭, 검색 시 map이동에 관한 통합 state
  const [searchCategory, setSearchCategory]: any = useState('');

  const fileInput: any = useRef();

  const [inputCount, setInputCount] = useState(0);
  const [textareaCount, setTextareaCount] = useState(0);

  //* 드롭다운 상태
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

  //* 추가버튼 눌렀을때 실행하는 함수
  const onClickAddData = async () => {
    if (imageUpload === null) {
      customAlert('이미지를 추가해주세요.');
      return;
    }
    if (town === '') {
      customAlert('지역을 선택해주세요.');
      return;
    }
    if (city === '읍/면 선택') {
      customAlert('읍/면을 선택해주세요.');
      return;
    }
    if (title === '') {
      customAlert('제목을 입력해주세요');
      return;
    }

    if (content === '') {
      customAlert('내용을 입력해주세요');
      return;
    }

    if (saveLatLng === undefined || saveAddress === undefined) {
      customAlert('지도에 마커를 찍어주세요');
      return;
    }
    const imageRef = ref(storageService, `images/${uuidv4()}`);
    uploadString(imageRef, imageUpload, 'data_url').then((response) => {
      getDownloadURL(response.ref).then((url) => {
        const response = url;
        postState = {
          ...postState,
          imgUrl: response,
        };
        onAddData(postState, {
          onSuccess: () => {
            queryClient.invalidateQueries('infiniteData');
            setIsModalPostActive(false);
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

  //select에서 value값 받아오기
  const onChangeFormSelect = (e: any) => {
    setCity(e.target.value);
  };

  const onChangeformSelectSub = (e: any) => {
    setPlace(e.target.value);
    setTown(e.target.value);
  };

  console.log('place', place);
  console.log(saveAddress);
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
        <StPostFormContainer>
          <StPostFormContentBox>
            <StPostFormConteTitle>내 스팟 추가하기</StPostFormConteTitle>
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
                <StPostFormContentName>지역선택</StPostFormContentName>
                <StPostFormCategoryWrap>
                  <StPostFormSelect onChange={onChangeFormSelect}>
                    <option value="선택">시 선택</option>
                    <option value="제주시">제주시</option>
                    <option value="서귀포시">서귀포시</option>
                  </StPostFormSelect>
                  <StPostFormSelect onChange={onChangeformSelectSub}>
                    {city === '제주시' ? (
                      <>
                        <option value="읍/면 선택">읍/면 선택</option>
                        <option value="제주시 시내">제주시 시내</option>
                        <option value="한림읍">한림읍</option>
                        <option value="조천읍">조천읍</option>
                        <option value="한경면">한경면</option>
                        <option value="추자면">추자면</option>
                        <option value="우도면">우도면</option>
                        <option value="구좌읍">구좌읍</option>
                        <option value="애월읍">애월읍</option>
                      </>
                    ) : city === '서귀포시' ? (
                      <>
                        <option value="읍/면 선택">읍/면 선택</option>
                        <option value="서귀포시 시내">서귀포시 시내</option>
                        <option value="표선면">표선면</option>
                        <option value="대정읍">대정읍</option>
                        <option value="남원읍">남원읍</option>
                        <option value="성산읍">성산읍</option>
                        <option value="안덕면">안덕면</option>
                      </>
                    ) : (
                      ''
                    )}
                  </StPostFormSelect>
                </StPostFormCategoryWrap>
              </StPostFormContentTop>
            </StPostFormContentWrap>

            <StPostFormInputWrap>
              <StPostFormInputTitle>제목</StPostFormInputTitle>
              <StPostFormInput
                placeholder="사진을 소개하는 제목을 적어주세요!"
                maxLength={15}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setInputCount(e.target.value.length);
                }}
              />
              <StPostFormInputCount>
                <span>{inputCount}</span>
                <span>/15 자</span>
              </StPostFormInputCount>
              <StPostFormInputTitle>내용</StPostFormInputTitle>
              <StPostFormTextareaWrap>
                <StPostFormTextarea
                  placeholder="사진의 구도, 촬영장소로 가는 방법, 촬영시간 등 꿀팁을 적어주세요.!"
                  maxLength={100}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setTextareaCount(e.target.value.length);
                  }}
                />
                <StPostFormTextareaCount>
                  <span>{textareaCount}</span>
                  <span>/100 자</span>
                </StPostFormTextareaCount>
              </StPostFormTextareaWrap>
            </StPostFormInputWrap>
            <StPostFormUploadButton>
              <CustomButton
                width="400px"
                height="48px"
                borderRadius="0px"
                color="white"
                backgroundColor="#1882FF"
                margin="0px 0px 0px 5px"
                onClick={onClickAddData}
              >
                업로드하기
              </CustomButton>
            </StPostFormUploadButton>
          </StPostFormContentBox>
        </StPostFormContainer>
      </StPostFormWrap>
    </>
  );
};

export default PostForm;

const StPostFormWrap = styled.div`
  display: flex;
  /* background-color: Red; */
  width: 1200px;
  /* justify-content: space-; */
  /* align-items: center; */
  /* background-color: yellow; */
  /* border: 1px solid black; */
`;

const StPostFormContainer = styled.div`
  /* background-color: green; */
  /* height: 300px; */
  /* width: 400px; */
  /* margin-top: -330px; */
  padding: 0px 60px;
`;

const StPostFormConteTitle = styled.h4`
  margin-left: 10px;
`;

const StPostFormContentBox = styled.div`
  /* background-color: green; */
  height: 300px;
  width: 400px;
  /* margin-top: -330px; */
  padding: 10px;
`;

const StPostFormContentWrap = styled.div`
  /* background-color: blue; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -20px;
`;

const StPostFormContentTop = styled.div`
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
  margin-left: -10px;
  padding: 5px;
`;

const StPostFormContentName = styled.span`
  font-weight: 700;
  margin-right: 145px;
  padding: 10px;
  font-size: 20px;
`;

const StPostFormCategoryWrap = styled.div`
  font-weight: 500;
  /* background-color: beige; */
  padding: 5px 0px;
  display: flex;
  margin-top: 10px;
`;

const StPostFormSelect = styled.select`
  font-size: 16px;
  font-weight: 400;
  height: 30px;
  width: 120px;
  border-radius: 20px;
  text-align: center;
  margin-left: 5px;
  border: none;
  background-color: #e7e7e7;
`;
const StPostFormButton = styled.div`
  /* background-color: #e7e7e7; */
  display: flex;
  margin-top: 15px;
`;

const StPostFormInputWrap = styled.div`
  margin-top: 15px;
  /* background-color: Red; */
  margin-left: 7px;
`;
const StPostFormInput = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  background-color: #f8f8f8;
  border-bottom: 1px solid blue;
  margin-bottom: 15px;
`;

const StPostFormTextareaWrap = styled.div`
  vertical-align: sub;
`;
const StPostFormTextarea = styled.textarea`
  width: 100%;
  height: 40px;
  border: none;
  background-color: #f8f8f8;
  border-bottom: 1px solid blue;
  margin-bottom: 15px;
`;

const StPostFormInputCount = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
`;

const StPostFormTextareaCount = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
`;

const StPostFormInputTitle = styled.p`
  font-size: 20px;
  font-weight: 700;
`;

const StPostFormUploadButton = styled.div`
  margin-top: 10px;
`;

const Img = styled.label`
  height: 200px;
  width: 160px;
  background-image: url(/Light.png);
  background-position: center;
  background-color: red;
  cursor: pointer;
  margin: 10px;
`;

const SpotImg = styled.img`
  height: 100%;
  width: 100%;
  align-items: center;
  object-fit: contain;
`;
