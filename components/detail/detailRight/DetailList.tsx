import { updateData } from '@/api';
import {
  deleteAtom,
  deletePostModalAtom,
  editBtnToggleAtom,
  editPlaceAtom,
  editSaveAddressAtom,
  editSaveLatLngAtom,
  imageUploadAtom,
} from '@/atom';
import DataError from '@/components/common/DataError';
import DataLoading from '@/components/common/DataLoading';
import { authService, storageService } from '@/firebase';
import { customAlert } from '@/utils/alerts';
import { logEvent } from '@/utils/amplitude';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { title } from 'process';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const DetailList = ({ item }: ItemProps) => {
  //! global state
  const [editBtnToggle, setEditBtnToggle] = useRecoilState(editBtnToggleAtom);
  const [editPlace, setEditPlace] = useRecoilState(editPlaceAtom);
  const [editSaveLatLng, setEditSaveLatLng] =
    useRecoilState(editSaveLatLngAtom);
  const [editSaveAddress, setEditSaveAddress] =
    useRecoilState(editSaveAddressAtom);
  const [imageUpload, setImageUpload] = useRecoilState(imageUploadAtom);
  const [deletePostData, setDeletePostData] = useRecoilState(deleteAtom);

  // 반응형 이용하기
  const [isOpen, setIsOpen] = useState(false);
  const [deletePostModal, setDeletePostModal] =
    useRecoilState(deletePostModalAtom);
  const isMobile = useMediaQuery({ maxWidth: 785 });
  const isPc = useMediaQuery({ minWidth: 786 });

  //! component state
  const [editTitle, setEditTitle]: any = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editTown, setEditTown] = useState('');

  //! 게시물 삭제 눌렀을 때 모달 창 실행하는 함수
  const postDeleteModalButton = () => {
    setDeletePostModal(!deletePostModal);
    setDeletePostData({
      ...deletePostData,
      id: item.id,
      imgPath: item.imgPath,
    });
  };

  //! 게시물 수정 버튼을 눌렀을때 실행하는 함수
  const onClickEditToggle = () => {
    setEditBtnToggle(!editBtnToggle);
    setImageUpload(null);
  };

  const router = useRouter(); //* 라우팅하기
  const queryClient = useQueryClient(); // * 쿼리 최신화하기
  const titleInput = useRef<HTMLInputElement>(null); //* DOM에 접근하기
  const contentInput = useRef<HTMLInputElement>(null);

  const [editTitleInputCount, setEditTitleInputCount] = useState(0);
  const [editContentInputCount, setEditContentInputCount] = useState(0);

  //* useMutation 사용해서 데이터 수정하기
  const {
    mutate: onUpdateData,
    isLoading,
    isError,
  } = useMutation<undefined, undefined, DeatailListItemType>(updateData);

  //* 수정 완료 버튼을 눌렀을 때 실행하는 함수
  const onClickEdit = (data: DeatailListItemType) => {
    if (titleInput.current?.value === '' || data.title === '') {
      customAlert('제목을 입력해주세요');
      return;
    }

    if (editTitleInputCount > 16) {
      customAlert('제목이 15자를 초과했어요.');
      return;
    }

    if (editCity === '' || editTown === '') {
      customAlert('카테코리를 입력해주세요');
      return;
    }

    if (contentInput.current?.value === '' || data.content === '') {
      customAlert('내용을 입력해주세요');
      return;
    }

    if (editContentInputCount > 101) {
      customAlert('내용이 100자를 초과했어요.');
      return;
    }

    if (editSaveLatLng === '' || editSaveAddress === '') {
      customAlert('지도에 마커를 찍어주세요');
      return;
    }

    const imageRef = ref(storageService, `images/${item.imgPath}`);

    if (imageUpload === null) {
      customAlert('이미지를 추가해주세요.');
      Swal.fire({
        icon: 'success',
        title: '수정사항이 저장 완료되었습니다!',
        confirmButtonColor: '#1882FF',
        confirmButtonText: ' 내 게시글 보러 가기',
      }).then((result) => {
        if (result.isConfirmed) {
          onUpdateData(
            { ...data, imgUrl: item.imgUrl },
            {
              onSuccess: () => {
                setTimeout(
                  () => queryClient.invalidateQueries('detailData'),
                  500
                );
                logEvent('수정 완료 버튼', { from: 'detail page' });
                setEditSaveLatLng([]);
                setEditSaveAddress('');
                setEditBtnToggle(!editBtnToggle);

                setTimeout(
                  () => queryClient.invalidateQueries('detailData'),
                  500
                );
                setImageUpload(null);
              },
            }
          );
        } else {
          setEditSaveLatLng([]);
          setEditSaveAddress('');
          setEditBtnToggle(!editBtnToggle);
          setImageUpload(null);
        }
      });
      return;
    }

    if (imageUpload !== null) {
      uploadString(imageRef, imageUpload, 'data_url').then((response) => {
        getDownloadURL(response.ref).then((url) => {
          const response = url;

          Swal.fire({
            icon: 'warning',
            title: '정말로 수정하시겠습니까?',
            confirmButtonColor: '#08818c',
            showCancelButton: true,
            confirmButtonText: '수정',
            cancelButtonText: '취소',
          }).then((result) => {
            if (result.isConfirmed) {
              onUpdateData(
                { ...data, imgUrl: response },
                {
                  onSuccess: () => {
                    setTimeout(
                      () => queryClient.invalidateQueries('detailData'),
                      500
                    );
                    logEvent('수정 완료 버튼', { from: 'detail page' });
                    setEditSaveLatLng([]);
                    setEditSaveAddress('');
                    setEditBtnToggle(!editBtnToggle);

                    setTimeout(
                      () => queryClient.invalidateQueries('detailData'),
                      500
                    );
                    setImageUpload(null);
                  },
                }
              );
            } else {
              setEditSaveLatLng([]);
              setEditSaveAddress('');
              setEditBtnToggle(!editBtnToggle);
              setImageUpload(null);
            }
          });
        });
      });
    }

    queryClient.invalidateQueries('detailData');
  };

  const onChangeCityInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditCity(e.target.value);
  };

  const onChangeTownInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditTown(e.target.value);
    setEditPlace(e.target.value);
  };

  //* 페이지 처음 들어왔을 때 상태값 유지하기
  useEffect(() => {
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCity(item.city);
    setEditTown(item.town);
  }, [editBtnToggle]);

  const onReset = () => {
    setEditTitle('');
  };

  //* 지도 클릭 시 카테고리 변경하기
  useEffect(() => {
    if (!editSaveAddress) {
      return;
    }

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

    const cityMap = editSaveAddress.split(' ')[1];
    const townMap = editSaveAddress.split(' ')[2];

    if (
      cityMap === '제주시' &&
      editCity === '제주시' &&
      townSub.indexOf(townMap) < 0
    ) {
      setEditTown('제주시 시내');
    } else if (
      cityMap === '서귀포시' &&
      editCity === '서귀포시' &&
      townSub.indexOf(townMap) < 0
    ) {
      setEditTown('서귀포시 시내');
    } else {
      setEditTown(townMap);
      setEditCity(cityMap);
    }
  }, [editSaveAddress]);

  if (isLoading) return <DataLoading />;
  if (isError) return <DataError />;

  if (!editBtnToggle) {
    return (
      <ListContainer>
        <TitleAndView>
          <>
            {isMobile && (
              <Link href="/main?city=제주전체">
                <Back
                  onClick={() => {
                    localStorage.clear();
                  }}
                >
                  <MobileBack src="/Back-point.png" alt="image" />
                </Back>
              </Link>
            )}
          </>
          <Title>{item.title} </Title>
          {isPc && (
            <View>
              <Image
                src="/view_icon.svg"
                alt="image"
                width={24}
                height={16}
                style={{ marginRight: 5 }}
              />
              <span style={{ color: '#1882FF', width: 70 }}>
                {item.clickCounter} view
              </span>
            </View>
          )}

          {authService.currentUser?.uid === item.creator ? (
            <>
              <div>
                <div onClick={() => setIsOpen(!isOpen)}>
                  <MenuPointImg src="/three-point.png" />
                </div>
                {isOpen === true ? (
                  <Menu>
                    <MenuItem onClick={onClickEditToggle}>게시물 수정</MenuItem>
                    <MenuItem onClick={postDeleteModalButton}>
                      게시물 삭제
                    </MenuItem>
                  </Menu>
                ) : null}
              </div>
            </>
          ) : null}
        </TitleAndView>
        <CityAndTownAndAddress>
          <City>{item.city}</City>
          <Town>{item.town}</Town>
          <HowManyView>
            {isMobile && (
              <View>
                <Image
                  src="/view_icon.svg"
                  alt="image"
                  width={24}
                  height={16}
                  style={{ marginRight: 5 }}
                />
                <span style={{ color: '#1882FF', width: 70 }}>
                  {item.clickCounter} view
                </span>
              </View>
            )}
          </HowManyView>

          <Address>
            {isPc && (
              <>
                <Image
                  src="/spot_icon.svg"
                  alt="image"
                  width={24}
                  height={24}
                />{' '}
                <AddressText>{item.address}</AddressText>
              </>
            )}

            <AddressCopy>copy</AddressCopy>
          </Address>
        </CityAndTownAndAddress>
        <>
          {isMobile && (
            <AddressWrap>
              <Image src="/spot_icon.svg" alt="image" width={15} height={15} />{' '}
              <AddressText>{item.address}</AddressText>
            </AddressWrap>
          )}
        </>
        <Content>
          <TipSpan>Tip</TipSpan>
          <TipBar src="/bar.png" alt="image" />
          <ContentSpan>{item.content}</ContentSpan>
        </Content>
      </ListContainer>
    );
  } else {
    return (
      <ListContainer>
        <TitleAndView>
          <TitleInputWrap>
            <TitleInputContainer>
              <TitleInput
                maxLength={15}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  setEditTitleInputCount(e.target.value.length);
                }}
                ref={titleInput}
                value={editTitle}
              />

              <EditclearBtn onClick={onReset} />
            </TitleInputContainer>
            <TitleInputSpan>
              {isPc && (
                <span
                  style={{
                    color: ' #F4F4F4',
                    width: 65,
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    marginLeft: '10%',
                  }}
                >
                  {editTitleInputCount} /15
                </span>
              )}
            </TitleInputSpan>
          </TitleInputWrap>
          {editBtnToggle ? (
            <EditBtnCotainer>
              <EditBox>
                <EditBtnWrap>
                  <EditBtn
                    onClick={() =>
                      onClickEdit({
                        id: item.id,
                        title: editTitle,
                        content: editContent,
                        city: editCity,
                        town: editTown,
                        lat: editSaveLatLng.Ma,
                        long: editSaveLatLng.La,
                        address: editSaveAddress,
                        imgUrl: '',
                      })
                    }
                  >
                    수정사항 저장
                  </EditBtn>
                  <EditBtnArrow src="/arrow-right-white.png" alt="image" />
                </EditBtnWrap>
                <EditBtnWrap>
                  <EditBtn onClick={onClickEditToggle}>수정하기 취소</EditBtn>
                  <EditBtnArrow src="/arrow-right-white.png" alt="image" />
                </EditBtnWrap>
              </EditBox>
            </EditBtnCotainer>
          ) : (
            <>
              <EditBtn onClick={onClickEditToggle}>게시물 수정</EditBtn>
            </>
          )}
        </TitleAndView>
        <CityAndTownAndAddress>
          <CityInput value={editCity} onChange={(e) => onChangeCityInput(e)}>
            <option value="제주시">제주시</option>
            <option value="서귀포시">서귀포시</option>
          </CityInput>
          <TownInput value={editTown} onChange={(e) => onChangeTownInput(e)}>
            {editCity === '제주시' && (
              <>
                <option value="제주시 시내">제주시 시내</option>
                <option value="한림읍">한림읍</option>
                <option value="조천읍">조천읍</option>
                <option value="한경면">한경면</option>
                <option value="추자면">추자면</option>
                <option value="우도면">우도면</option>
                <option value="구좌읍">구좌읍</option>
                <option value="애월읍">애월읍</option>
              </>
            )}

            {editCity === '서귀포시' && (
              <>
                <option value="서귀포시 시내">서귀포시 시내</option>
                <option value="표선면">표선면</option>
                <option value="대정읍">대정읍</option>
                <option value="남원읍">남원읍</option>
                <option value="성산읍">성산읍</option>
                <option value="안덕면">안덕면</option>
              </>
            )}
          </TownInput>
          <HowManyView>
            {isMobile && (
              <View>
                <Image
                  src="/view_icon.svg"
                  alt="image"
                  width={24}
                  height={16}
                  style={{ marginRight: 5 }}
                />
                <span style={{ color: '#1882FF', width: 70 }}>
                  {item.clickCounter} view
                </span>
              </View>
            )}
          </HowManyView>
        </CityAndTownAndAddress>
        <AddressWrap>
          <Image src="/spot_icon.svg" alt="image" width={15} height={15} />{' '}
          <AddressText>{item.address}</AddressText>
        </AddressWrap>
        <ContentInputContainer>
          <ContentInputWrap>
            <ContentInput
              maxLength={100}
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value);
                setEditContentInputCount(e.target.value.length);
              }}
              ref={contentInput}
            />
            <ContentInputSpan>
              <span
                style={{
                  color: ' #F4F4F4',
                  width: 100,
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  marginLeft: 20,
                }}
              >
                {' '}
                {editContentInputCount} /100
              </span>
            </ContentInputSpan>
          </ContentInputWrap>

          <ClearBtn
            onClick={() => {
              setEditContent('');
            }}
          ></ClearBtn>
        </ContentInputContainer>
      </ListContainer>
    );
  }
};

export default DetailList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media ${(props) => props.theme.mobile} {
    margin-top: -20px;
    margin-left: 15px;
    width: 350px;
    height: 120px;
    margin: auto;
  }
`;
const Back = styled.div`
  z-index: 100;
  position: absolute;
  top: 1px;
  left: 1px;
`;
const MobileBack = styled.img`
  width: 12px;
  height: 22px;
`;
const MenuPointImg = styled.img`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0%;
  top: 30%;
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4px;
    height: 16px;
  }
`;

const Menu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: -15%;
  top: 0;
  font-size: 13px;
  border: 1px solid #d9d9d9;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.21);
  width: 88px;
  height: 90px;
  place-content: center;
  gap: 19px;
  background-color: #f4f4f4;
  transition: 0.3s;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    right: 5%;
  }
`;
const MenuItem = styled.div`
  display: flex;
  transition: 0.3s;
  padding: 3px;
  cursor: pointer;
  :hover {
    transition: 0.4s;
    background-color: #4176ff;
    color: white;
    border-radius: 24px;
  }
`;
const TitleAndView = styled.div`
  display: flex;
  justify-content: flex-start;
  position: relative;
  flex-direction: row;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    width: 96.5vw;
    position: absolute;
    top: 70px;
    padding-left: 12px;
  }
`;

const Title = styled.div`
  position: relative;
  font-size: 30px;
  margin-right: 20px;
  margin-bottom: 5px;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 28px;
  font-weight: bold;
  color: #212121;
  @media ${(props) => props.theme.mobile} {
    font-size: 20px;
    padding-left: 10px;
  }
`;
const EditclearBtn = styled.div`
  /* position: absolute; */
  /* top: 25%; */
  /* left: 460px; */
  vertical-align: middle;
  align-self: center;
  width: 24px;
  height: 24px;
  background-image: url(/cancle-button-black.png);
  background-repeat: no-repeat;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    /* transform: translate(-110%, 920%); */
    position: relative;
    margin-left: 23px;
    margin-top: 8px;
  }
`;

const TitleInputWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  @media ${(props) => props.theme.mobile} {
    width: 70%;
    align-items: center;
    /* margin-right: 17%; */
  }
`;

const TitleInputContainer = styled.div`
  border-bottom: 2px solid #1882ff;
  background: #fbfbfb;
  width: 490px;
  height: 53px;
  display: flex;
  margin-right: 30px;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
    align-items: center;
  }
`;

const TitleInput = styled.input`
  font-size: 28px;
  color: #212121;
  padding-left: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: none;
  border-bottom: 2px solid #1882ff;
  background: #fbfbfb;
  width: 460px;
  height: 53px;
  :focus-visible {
    outline: none;
  }
  @media ${(props) => props.theme.mobile} {
    width: 80%;
    border-bottom: 1px solid #1882ff;
  }
`;

const TitleInputSpan = styled.div`
  display: flex;
  margin-top: 5px;
  color: #8e8e93;
  font-size: 14px;
`;
const HowManyView = styled.div`
  @media ${(props) => props.theme.mobile} {
    padding-left: 100px;
    width: 40%;
  }
`;

const View = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100px;
  font-size: 14px;
  @media ${(props) => props.theme.mobile} {
    width: 75px;
    margin-left: 0px;
  }
`;

const EditBtnCotainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  height: 76px;
  place-content: center;
  gap: 10px;
  background-color: #feb819;
  border-radius: 10px;
  left: 1221px;
  top: 104px;
  @media ${(props) => props.theme.mobile} {
    width: 90px;
    place-content: right;
    height: 60px;
  }
`;
const EditBtnWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const EditBtn = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 97px;
  height: 22px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  @media ${(props) => props.theme.mobile} {
    display: flex;
    font-size: 11px;
    width: 65px;
  }
`;

const EditBtnArrow = styled.img`
  display: relative;
  background-color: transparent;
  width: 16px;
  height: 16px;
  margin-top: 3px;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    width: 12px;
    height: 12px;
  }
`;

const CityAndTownAndAddress = styled.div`
  display: flex;
  gap: 10px;
  @media ${(props) => props.theme.mobile} {
    /* width: 350px; */
    margin-top: 10px;
  }
`;

const City = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 99px;
  height: 30px;
  text-align: center;
  padding-top: 4px;
  font-size: 12px;
  color: #1c1c1e;
  @media ${(props) => props.theme.mobile} {
    width: 80px;
    height: 25px;
    font-size: 12px;
  }
`;

const CityInput = styled.select`
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 88px;
  height: 30px;
  text-align: center;
  border: none;
`;

const Town = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 88px;
  height: 30px;
  text-align: center;
  padding-top: 4px;
  font-size: 12px;
  color: #1c1c1e;
  @media ${(props) => props.theme.mobile} {
    width: 66px;
    height: 25px;
    font-size: 12px;
  }
`;

const TownInput = styled.select`
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 77px;
  height: 30px;
  text-align: center;
  border: none;
`;

const AddressWrap = styled.div`
  @media ${(props) => props.theme.mobile} {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;
  }
`;
const Address = styled.div`
  display: flex;
  /* justify-content: flex-end; */
  font-size: 16px;
  align-items: center;
  gap: 10px;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    width: 0px;
    font-size: 16px;
  }
`;
const AddressCopy = styled.div`
  display: flex;
  align-items: center;
  text-decoration: underline;
  color: #8e8e93;
  font-size: 14px;
  width: 31px;
  height: 21px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(0%, 190%);
    width: 10px;
  }
`;

const AddressText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media ${(props) => props.theme.mobile} {
    overflow: visible;
    white-space: normal;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  background-color: #f4f4f4;
  width: 100%;
  /* height: 50px; */
  max-height: 100px;
  padding-left: 20px;
  color: #8e8e93;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  position: relative;
  @media ${(props) => props.theme.mobile} {
    width: 350px;
    max-height: 200px;
  }
`;

const ContentInputContainer = styled.div`
  position: relative;
  @media ${(props) => props.theme.mobile} {
    width: 90vw;
  }
`;

const ContentInputWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  @media ${(props) => props.theme.mobile} {
    width: 90vw;
    align-items: flex-start;
  }
`;
const ContentInput = styled.input`
  font-size: 14px;
  min-height: 30px;
  padding-left: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
  border-bottom: 2px solid #1882ff;
  background: #fbfbfb;
  width: 650px;
  height: 49px;
  :focus-visible {
    outline: none;
  }
  @media ${(props) => props.theme.mobile} {
    width: 90vw;
  }
`;
const ContentInputSpan = styled.div`
  margin-top: 5px;
  color: #8e8e93;
  font-size: 14px;
`;
const ClearBtn = styled.div`
  position: absolute;
  top: 25%;
  left: 620px;
  width: 24px;
  height: 24px;
  background-image: url(/cancle-button-black.png);
  background-repeat: no-repeat;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    display: flex;
    left: 90%;
  }
`;
const TipSpan = styled.span`
  width: 10px;
  font-size: 16px;
  @media ${(props) => props.theme.mobile} {
    width: 30px;
  }
`;
const TipBar = styled.img`
  width: 3px;
  height: 24px;
  display: flex;
  justify-content: flex-end;
  margin-left: 30px;
  @media ${(props) => props.theme.mobile} {
    width: 3px;
    margin-left: 10px;
  }
`;
const ContentSpan = styled.span`
  overflow: hidden;
  /* text-overflow: ellipsis; */
  /* white-space: nowrap; */
  margin-left: 20px;
  margin-right: 20px;
  font-size: 14px;
`;

const DetailBtn = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: #feb819;
  color: white;
  cursor: pointer;
  width: 150px;
  height: 40px;
  bottom: 120px;
  font-size: 13px;
  @media ${(props) => props.theme.mobile} {
    top: 400px;
    bottom: 0px;
  }
`;

const EditBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media ${(props) => props.theme.mobile} {
    gap: 3px;
  }
`;
