import { deleteData, postCounter, updateData, visibleReset } from '@/api';
import {
  editBtnToggleAtom,
  editPlaceAtom,
  editSaveAddressAtom,
  editSaveLatLngAtom,
} from '@/atom';
import DataError from '@/components/common/DataError';
import DataLoading from '@/components/common/DataLoading';
import { authService, storageService } from '@/firebase';
import { customAlert } from '@/utils/alerts';
import { logEvent } from '@/utils/amplitude';
import { deleteObject, ref } from 'firebase/storage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const DetailList = ({ item }: any) => {
  //! global state
  const [editBtnToggle, setEditBtnToggle] = useRecoilState(editBtnToggleAtom);
  const [editPlace, setEditPlace] = useRecoilState(editPlaceAtom);
  const [editSaveLatLng, setEditSaveLatLng]: any =
    useRecoilState(editSaveLatLngAtom);
  const [editSaveAddress, setEditSaveAddress] =
    useRecoilState(editSaveAddressAtom);

  //! component state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editTown, setEditTown] = useState('');

  //! 게시물 수정 버튼을 눌렀을때 실행하는 함수
  const onClickEditToggle = () => {
    setEditBtnToggle(!editBtnToggle);
  };

  const router = useRouter(); //* 라우팅하기
  const queryClient = useQueryClient(); // * 쿼리 최신화하기
  const titleInput = useRef<HTMLInputElement>(null); //* DOM에 접근하기
  const contentInput = useRef<HTMLInputElement>(null);

  const [editTitleInputCount, setEditTitleInputCount] = useState(0);
  const [editContentInputCount, setEditContentInputCount] = useState(0);

  //* useMutation 사용해서 데이터 삭제하기
  const { mutate: onDeleteData } = useMutation(deleteData);

  //* 게시물 삭제 버튼을 눌렀을 때 실행하는 함수
  const onClickDelete = (docId: any) => {
    const imageRef = ref(storageService, `images/${item.imgPath}`);

    Swal.fire({
      icon: 'warning',
      title: '정말로 삭제하시겠습니까?',
      confirmButtonColor: '#08818c',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteObject(imageRef)
          .then(() => {
            console.log('스토리지를 파일을 삭제를 성공했습니다');
          })
          .catch((error) => {
            console.log('스토리지 파일 삭제를 실패했습니다');
          });

        onDeleteData(docId, {
          onSuccess: () => {
            setTimeout(
              () => queryClient.invalidateQueries('infiniteData'),
              500
            );
            logEvent('게시물 삭제 버튼', { from: 'detail page' });
            router.push('/main?city=제주전체');
          },
        });
        visibleReset();
      }
    });
  };

  //* useMutation 사용해서 데이터 수정하기
  const { mutate: onUpdateData, isLoading, isError } = useMutation(updateData);

  //* 수정 완료 버튼을 눌렀을 때 실행하는 함수
  const onClickEdit = (data: any) => {
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

    console.log('data: ', data);

    Swal.fire({
      icon: 'warning',
      title: '정말로 수정하시겠습니까?',
      confirmButtonColor: '#08818c',
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdateData(data, {
          onSuccess: () => {
            // setEditState(data);
            setTimeout(() => queryClient.invalidateQueries('detailData'), 500);
            logEvent('수정 완료 버튼', { from: 'detail page' });
            setEditSaveLatLng([]);
            setEditSaveAddress('');
            setEditBtnToggle(!editBtnToggle);
          },
        });
      } else {
        setEditSaveLatLng([]);
        setEditSaveAddress('');
        setEditBtnToggle(!editBtnToggle);
      }
    });
  };

  const onChangeCityInput = (e: any) => {
    setEditCity(e.target.value);
  };

  const onChangeTownInput = (e: any) => {
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

  //* 지도 클릭 시 카테고리 변경하기
  // console.log('saveAddress: ', saveAddress);
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

    console.log('cityMap: ', cityMap);
    console.log('townMap: ', townMap);

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

  // //* mutation 사용해서 counting값 보내기
  // const { mutate: countMutate } = useMutation(postCounter, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries('detailData');
  //   },
  // });

  // //* 변화된 counting 값 인지
  // useEffect(() => {
  //   if (item.creator !== authService.currentUser?.uid) {
  //     countMutate(item.id);
  //   }
  // }, []);

  if (isLoading) return <DataLoading />;
  if (isError) return <DataError />;

  if (!editBtnToggle) {
    return (
      <ListContainer>
        <TitleAndView>
          <Title>{item.title} </Title>
          <View>
            <Image
              src="/view_icon.svg"
              alt="image"
              width={20}
              height={20}
              style={{ marginRight: 5 }}
            />
            <span style={{ color: '#1882FF', width: 70 }}>
              {item.clickCounter} view
            </span>
          </View>
          {authService.currentUser?.uid === item.creator ? (
            <EditBtn onClick={onClickEditToggle}>게시물 수정 〉</EditBtn>
          ) : null}
        </TitleAndView>
        <CityAndTownAndAddress>
          <City>{item.city}</City>
          <Town>{item.town}</Town>
          <Address>
            <Image src="/spot_icon.svg" alt="image" width={15} height={15} />{' '}
            <AddressText>{item.address}</AddressText>
          </Address>
        </CityAndTownAndAddress>
        <Content>
          <TipSpan>Tip |</TipSpan>
          <ContentSpan>{item.content}</ContentSpan>
        </Content>
      </ListContainer>
    );
  } else {
    return (
      <ListContainer>
        <TitleAndView>
          <TitleInput
            maxLength={15}
            defaultValue={item.title}
            onChange={(e) => {
              setEditTitle(e.target.value);
              setEditTitleInputCount(e.target.value.length);
            }}
            ref={titleInput}
          />
          <span
            style={{
              color: '#8E8E93',
              width: 100,
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            {editTitleInputCount} /15
          </span>

          {editBtnToggle ? (
            <EditBtnCotainer>
              <EditBtn onClick={() => onClickDelete(item.id)}>
                게시물 삭제 〉
              </EditBtn>
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
                    // ...editState,
                  })
                }
              >
                수정 완료 〉
              </EditBtn>
              <EditBtn onClick={onClickEditToggle}>취소 〉</EditBtn>
            </EditBtnCotainer>
          ) : (
            <>
              <View>
                <Image
                  src="/view_icon.svg"
                  alt="image"
                  width={20}
                  height={20}
                  style={{ marginRight: 5 }}
                />
                <span
                  style={{
                    color: '#1882FF',
                  }}
                >
                  {item.clickCounter} view
                </span>
              </View>

              <EditBtn onClick={onClickEditToggle}>게시물 수정 〉</EditBtn>
            </>
          )}
        </TitleAndView>
        <CityAndTownAndAddress>
          <CityInput
            // defaultValue={item.city}
            value={editCity}
            // ref={cityInput}
            onChange={(e) => onChangeCityInput(e)}
          >
            <option value="제주시">제주시</option>
            <option value="서귀포시">서귀포시</option>
          </CityInput>
          <TownInput
            // defaultValue={item.town}
            value={editTown}
            // ref={townInput}
            onChange={(e) => onChangeTownInput(e)}
          >
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
          <Address>
            <Image src="/spot_icon.svg" alt="image" width={15} height={15} />{' '}
            <span>{item.address}</span>
          </Address>
        </CityAndTownAndAddress>
        <Content>
          Tip
          <ContentInput
            // value={editContent}
            maxLength={100}
            defaultValue={item.content}
            onChange={(e) => {
              setEditContent(e.target.value);
              setEditContentInputCount(e.target.value.length);
            }}
            ref={contentInput}
          />
          <span
            style={{
              color: '#8E8E93',
              width: 100,
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: 20,
            }}
          >
            {editContentInputCount} /100
          </span>
        </Content>
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
    width: 350px;
    /* height: 120px; */
    max-height: 200px;
    margin: auto;
  }
`;

const TitleAndView = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    width: 350px;
    position: absolute;
    top: 70px;
  }
`;

const Title = styled.div`
  font-size: 30px;
  margin-right: 20px;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media ${(props) => props.theme.mobile} {
    font-size: 17px;
  }
`;

const TitleInput = styled.input`
  font-size: 30px;
  margin-right: 20px;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const View = styled.div`
  display: flex;
  align-items: center;
  width: 90px;
  @media ${(props) => props.theme.mobile} {
    width: 80px;
  }
`;

const EditBtnCotainer = styled.div`
  display: flex;
  gap: 10px;
  width: 300px;
  margin-left: 20px;
`;

const EditBtn = styled.div`
  background-color: #feb819;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
  width: 120px;
  cursor: pointer;
  height: 50px;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;

const CityAndTownAndAddress = styled.div`
  display: flex;
  gap: 10px;
  @media ${(props) => props.theme.mobile} {
    width: 350px;
    margin-top: 10px;
  }
`;

const City = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 200px;
  height: 40px;
  text-align: center;
  padding-top: 4px;
  @media ${(props) => props.theme.mobile} {
    width: 75px;
    font-size: 12px;
  }
`;

const CityInput = styled.select`
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 200px;
  height: 40px;
  text-align: center;
  border: none;
`;

const Town = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 200px;
  height: 40px;
  text-align: center;
  padding-top: 4px;
  @media ${(props) => props.theme.mobile} {
    width: 75px;
    font-size: 12px;
  }
`;

const TownInput = styled.select`
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 200px;
  height: 40px;
  text-align: center;
  border: none;
`;

const Address = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    width: 200px;
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
  background-color: #f8f8f8;
  width: 100%;
  /* height: 50px; */
  max-height: 100px;
  padding-left: 20px;
  color: #8e8e93;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 5px;
  @media ${(props) => props.theme.mobile} {
    width: 350px;
    max-height: 200px;
  }
`;

const ContentInput = styled.input`
  width: 80%;
  min-height: 30px;
  padding-left: 10px;
  margin-left: 20px;
  border: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TipSpan = styled.span`
  width: 80px;
  @media ${(props) => props.theme.mobile} {
    width: 160px;
  }
`;

const ContentSpan = styled.span`
  overflow: hidden;
  /* text-overflow: ellipsis; */
  /* white-space: nowrap; */
  margin-left: 20px;
  margin-right: 20px;
`;

const EditTitleClearBtn = styled.div`
  position: absolute;
  top: 18.5%;
  right: 42%;
  width: 24px;
  height: 24px;
  background-image: url(/cancle-button.png);
  background-repeat: no-repeat;

  cursor: pointer;
`;

const EditContentClearBtn = styled.div`
  position: absolute;
  top: 33.8%;
  right: 19%;
  width: 24px;
  height: 24px;
  background-image: url(/cancle-button.png);
  background-repeat: no-repeat;

  cursor: pointer;
`;
