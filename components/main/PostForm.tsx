import { authService, storageService } from '@/firebase';
import { useEffect, useRef, useState } from 'react';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { useMutation, useQueryClient } from 'react-query';
import { addData, visibleReset } from '@/api';
import styled from 'styled-components';
import MapsPostLanding from '../detail/MapsPostLanding';
import { v4 as uuidv4 } from 'uuid';
import { CustomButton } from '../common/CustomButton';
import { customAlert, customConfirm } from '@/utils/alerts';
import { useRecoilState } from 'recoil';
import {
  placeAtom,
  postModalAtom,
  saveAddressAtom,
  saveLatLngAtom,
  searchCategoryAtom,
} from '@/atom';
import DataLoading from '@/components/common/DataLoading';
import { useMediaQuery } from 'react-responsive';
import imageCompression from 'browser-image-compression';

const PostForm = () => {
  const queryClient = useQueryClient();
  const [saveLatLng, setSaveLatLng] = useRecoilState(saveLatLngAtom);
  const [saveAddress, setSaveAddress] = useRecoilState(saveAddressAtom);

  //* category 클릭, 검색 시 map이동에 관한 통합 state
  const fileInput: any = useRef();

  const [inputCount, setInputCount] = useState(0);
  const [textareaCount, setTextareaCount] = useState(0);

  //* 카테고리
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  //* 이미지 업로드
  const [imageUpload, setImageUpload]: any = useState(null);
  const imgPath: any = uuidv4();

  const [postMapModal, setIsPostMapModal] = useRecoilState(postModalAtom);
  const nickname = authService?.currentUser?.displayName;
  const isMobile = useMediaQuery({ maxWidth: 766 });
  const isPc = useMediaQuery({ minWidth: 767 });

  const [place, setPlace] = useRecoilState(placeAtom);
  const [isOpenMap, setIsOpenMap] = useState(false);
  const onClickOpen = () => {
    setIsOpenMap(!isOpenMap);
  };
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
    imgPath: imgPath,
  };

  //* useMutation 사용해서 포스트 추가하기
  const { mutate: onAddData, isLoading } = useMutation(addData);

  //* image 업로드 후 화면 표시 함수
  // 수정코드
  const handleImageChange = async (e: any) => {
    let file: any = e.target.files;

    if (file.length === 0) {
      return;
    } else {
      const {
        currentTarget: { files },
      } = e;

      const options = {
        maxSizeMB: 1, //* 허용하는 최대 사이즈 지정
        maxWidthOrHeight: 500, //* 허용하는 최대 width, height 값 지정
        useWebWorker: true, //* webworker 사용 여부
      };

      let theFile = files[0];
      // console.log('theFile; ', theFile);

      try {
        const compressedFile = await imageCompression(theFile, options);
        // console.log('compressedFile: ', compressedFile);

        const reader = new FileReader();
        // reader?.readAsDataURL(theFile);
        reader?.readAsDataURL(compressedFile);
        reader.onloadend = (finishedEvent) => {
          const {
            currentTarget: { result },
          }: any = finishedEvent;
          setImageUpload(result);
        };
      } catch (error) {
        console.log(error);
      }
    }
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

    const imageRef: any = ref(storageService, `images/${imgPath}`);
    // console.log('imgPath: ', imgPath);
    // console.log('imageRef._location.path: ', imageRef._location.path);

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
            setIsPostMapModal(false);
            customConfirm('등록을 완료하였습니다!');
          },
        });
      });
    });

    visibleReset();
  };

  //* 카테고리버튼 눌렀을 때 실행하는 함수

  //select에서 value값 받아오기
  const onChangeFormSelect = (e: any) => {
    setCity(e.target.value);
  };

  const onChangeFormSelectSub = (e: any) => {
    setPlace(e.target.value);
    setTown(e.target.value);
  };

  // 지도에 마커 변경시 카테고리 변경
  useEffect(() => {
    if (!saveAddress) {
      return;
    }
    const cityMap = saveAddress.split(' ')[1];
    const townMap = saveAddress.split(' ')[2];

    const townSub = [
      '한림읍',
      '조천읍',
      '한경면',
      '추자면',
      '우도면',
      '구좌읍',
      '애월읍',
      '표선면',
      '대정읍',
      '성산읍',
      '안덕면',
      '남원읍',
    ];

    if (cityMap === '제주시') {
      if (townSub.indexOf(townMap) < 0) {
        setCity(cityMap);
        setTown('제주시 시내');
      } else {
        setTown(townMap);
        setCity(cityMap);
      }
    } else if (cityMap === '서귀포시') {
      if (townSub.indexOf(townMap) < 0) {
        setCity(cityMap);
        setTown('서귀포시 시내');
      } else {
        setTown(townMap);
        setCity(cityMap);
      }
    }
  }, [saveAddress]);

  if (isLoading) {
    return <DataLoading />;
  }

  return (
    <>
      <PostFormWrap>
        {isPc && (
          <MapsPostLandingWrap>
            <MapsPostLanding />
          </MapsPostLandingWrap>
        )}

        {isMobile && isOpenMap && (
          <MapsPostLandingWrap>
            <MapsPostLanding />
            <PostFormMapsBackButton
              onClick={() => {
                setIsOpenMap(!isOpenMap);
              }}
            >
              <img src="/drag_handle.svg" />
            </PostFormMapsBackButton>
          </MapsPostLandingWrap>
        )}

        <PostFormContainer>
          <PostFormContentBox>
            <PostFormContenTitle>
              <PostFormBackButton
                onClick={() => {
                  setIsPostMapModal(!postMapModal);
                }}
              >
                {isMobile && <img src="/Back-point.png" />}
              </PostFormBackButton>
              내 스팟 추가하기
            </PostFormContenTitle>
            <PostFormContentWrap>
              <div
                style={{
                  display: 'flex',
                  width: 'auto',
                  flexDirection: 'row',
                }}
              >
                <Img>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
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
              <PostFormContentTop>
                <PostFormContentName>지역선택</PostFormContentName>
                <PostFormCategoryWrap>
                  <PostFormSelect value={city} onChange={onChangeFormSelect}>
                    <option value="선택">시 선택</option>
                    <option value="제주시">제주시</option>
                    <option value="서귀포시">서귀포시</option>
                  </PostFormSelect>
                  <PostFormSelect value={town} onChange={onChangeFormSelectSub}>
                    {city === '제주시' ? (
                      <>
                        {/* <option value="읍/면 선택">읍/면 선택</option> */}
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
                        {/* <option value="읍/면 선택">읍/면 선택</option> */}
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
                  </PostFormSelect>
                </PostFormCategoryWrap>
              </PostFormContentTop>
            </PostFormContentWrap>

            <PostFormInputWrap>
              <PostFormInputTitle>제목</PostFormInputTitle>
              <PostFormInput
                placeholder="사진을 소개하는 제목을 적어주세요!"
                maxLength={13}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setInputCount(e.target.value.length);
                }}
              />
              <PostFormInputCount>
                <span>{inputCount}</span>
                <span>/13 자</span>
              </PostFormInputCount>
              <PostFormInputTitle>내용</PostFormInputTitle>
              <PostFormContentTextWrap>
                <PostFormContentText
                  placeholder="사진의 구도, 촬영장소로 가는 방법, 촬영시간 등 꿀팁을 적어주세요.!"
                  maxLength={100}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setTextareaCount(e.target.value.length);
                  }}
                />
                <PostFormContentTextCount>
                  <span>{textareaCount}</span>
                  <span>/100 자</span>
                </PostFormContentTextCount>
              </PostFormContentTextWrap>
            </PostFormInputWrap>
            <PostFormUploadButton>
              <CustomButton
                width="100%"
                height="48px"
                borderRadius="0px"
                color="white"
                margin="0px 5px"
                padding="0px"
                backgroundColor="#1882FF"
                onClick={onClickAddData}
              >
                업로드하기
              </CustomButton>
            </PostFormUploadButton>
            {isMobile && (
              <PostFormUploadButton>
                <CustomButton
                  width="100%"
                  height="48px"
                  borderRadius="0px"
                  margin="0px 5px"
                  padding="0px"
                  backgroundColor="white"
                  color="#1882FF"
                  onClick={onClickOpen}
                >
                  지도에서 핀 찍기
                </CustomButton>
              </PostFormUploadButton>
            )}
          </PostFormContentBox>
        </PostFormContainer>
      </PostFormWrap>
    </>
  );
};

export default PostForm;

const PostFormWrap = styled.div`
  display: flex;
  @media ${(props) => props.theme.mobile} {
    display: flex;
    align-items: center;
    flex-direction: column-reverse;
    justify-content: flex-end;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    position: relative;
  }
`;

const MapsPostLandingWrap = styled.div`
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    height: 50vh;
    position: absolute;
    z-index: 9999;
    transform: translateX(350deg);
    transition: all 1s ease-in-out;
  }
`;

const PostFormContainer = styled.div`
  padding: 0px 60px;
  background-color: white;
  @media ${(props) => props.theme.mobile} {
    padding: 0px;
    height: 50vh;
    z-index: 999;
  }
`;

const PostFormContenTitle = styled.h4`
  margin-left: 10px;
  @media ${(props) => props.theme.mobile} {
    position: relative;
    background-color: white;
    display: flex;
    justify-content: center;
  }
`;

const PostFormContentBox = styled.div`
  height: 300px;
  width: 400px;
  padding: 10px;
  @media ${(props) => props.theme.mobile} {
    width: 425px;
  }
`;

const PostFormContentWrap = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: -20px;
  @media ${(props) => props.theme.mobile} {
    padding: 0 10px;
    margin-top: 10%;
  }
`;

const PostFormContentTop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
  @media ${(props) => props.theme.mobile} {
    margin-right: 10px;
    margin-top: 0px;
  }
`;

const PostFormContentName = styled.span`
  font-weight: 700;
  margin-right: 145px;
  padding: 10px;
  font-size: 20px;
  @media ${(props) => props.theme.mobile} {
    font-size: 18px;
  }
`;

const PostFormCategoryWrap = styled.div`
  font-weight: 500;
  padding: 5px 0px;
  display: flex;
  margin-top: 10px;
  @media ${(props) => props.theme.mobile} {
  }
`;

const PostFormSelect = styled.select`
  font-size: 16px;
  font-weight: 400;
  height: 30px;
  width: 120px;
  border-radius: 20px;
  text-align: center;
  margin-left: 5px;
  border: none;
  background-color: #e7e7e7;
  @media ${(props) => props.theme.mobile} {
  }
`;

const PostFormInputWrap = styled.div`
  margin-top: 15px;
  margin-left: 7px;
  @media ${(props) => props.theme.mobile} {
    width: 80%;
    margin: 0 auto;
    margin-top: 13%;
  }
`;
const PostFormInput = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  background-color: #f8f8f8;
  border-bottom: 1px solid blue;
  margin-bottom: 15px;
  @media ${(props) => props.theme.mobile} {
  }
`;

const PostFormContentTextWrap = styled.div`
  vertical-align: sub;
`;
const PostFormContentText = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  background-color: #f8f8f8;
  border-bottom: 1px solid blue;
  margin-bottom: 15px;
`;

const PostFormInputCount = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
`;

const PostFormContentTextCount = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
`;

const PostFormInputTitle = styled.p`
  font-size: 20px;
  font-weight: 700;
`;

const PostFormUploadButton = styled.div`
  margin-top: 10px;
  @media ${(props) => props.theme.mobile} {
    margin: 5px -10px;
    margin-top: 5%;
  }
`;

const Img = styled.label`
  height: 200px;
  width: 160px;
  background-image: url(/Light.png);
  background-position: center;
  cursor: pointer;
  margin: 10px;
  @media ${(props) => props.theme.mobile} {
    height: 100px;
    width: 100px;
  }
`;

const SpotImg = styled.img`
  height: 100%;
  width: 100%;
  align-items: center;
  object-fit: contain;
`;

// 모바일 시 뒤로가기 버튼
const PostFormBackButton = styled.div`
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    left: 5%;
  }
`;

const PostFormMapsBackButton = styled.div`
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    z-index: 9999;
    left: 45%;
    top: 97%;
    padding: 5px;
    cursor: pointer;
  }
`;
