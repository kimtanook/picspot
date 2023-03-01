import { deleteData, updateData, visibleReset } from '@/api';
import { authService } from '@/firebase';
import { customAlert } from '@/utils/alerts';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

const DetailList = ({
  item,
  editBtnToggle,
  onClickEditToggle,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  editCity,
  setEditCity,
  editTown,
  setEditTown,
  onClickEditTown,
  editData,
  saveLatLng,
  setSaveLatLng,
  saveAddress,
  setSaveAddress,
  setEditBtnToggle,
}: any) => {
  const router = useRouter(); //* 라우팅하기
  const queryClient = useQueryClient(); // * 쿼리 최신화하기

  //* useMutation 사용해서 데이터 삭제하기
  const { mutate: onDeleteData } = useMutation(deleteData);

  //* 게시물 삭제 버튼을 눌렀을 때 실행하는 함수
  const onClickDelete = (docId: any) => {
    onDeleteData(docId, {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries('infiniteData'), 500);
        customAlert('삭제를 완료하였습니다!');
        router.push('/main?city=제주전체');
      },
    });
    visibleReset();
  };

  //* useMutation 사용해서 데이터 수정하기
  const { mutate: onUpdateData } = useMutation(updateData);

  //* 수정 완료 버튼을 눌렀을 때 실행하는 함수
  const onClickEdit = (data: any) => {
    if (editTitle === '') {
      customAlert('제목을 입력해주세요');
      return;
    }

    if (editContent === '') {
      customAlert('내용을 입력해주세요');
      return;
    }

    if (editCity === '' || editTown === '') {
      customAlert('카테고리를 입력해주세요');
      return;
    }

    if (saveLatLng === undefined || saveAddress === undefined) {
      customAlert('지도에 마커를 찍어주세요');
      return;
    }

    //! 기능
    //* 뮤테이션을 사용하여 데이터를 수정하고 invalidateQueries를 사용해 쿼리를 최신화 했습니다.
    onUpdateData(data, {
      onSuccess: () => {
        //! 로직 : setTimeOut을 사용
        //* invalidateQueries 실행이 완료되기 전에 화면이 보여지는 문제로 인해
        //* setTimeOut을 사용해 0.5초 뒤에 invalidateQueries가 실행되도록 했습니다.
        setTimeout(() => queryClient.invalidateQueries('detailData'), 500);
        customAlert('수정을 완료하였습니다!');
        setEditTitle('');
        setEditContent('');
        setEditCity('');
        setEditTown('');
        setSaveLatLng([]);
        setSaveAddress('');
        setEditBtnToggle(!editBtnToggle);
      },
    });
  };

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
            <span
              style={{
                marginLeft: 10,
                textDecoration: 'underLine',
                color: '#8E8E93',
                cursor: 'pointer',
              }}
            >
              copy
            </span>
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
            defaultValue={item.title}
            onChange={(e) => {
              setEditTitle(e.target.value);
            }}
          />

          {editBtnToggle ? (
            <EditBtnCotainer>
              <EditBtn onClick={() => onClickDelete(item.id)}>
                게시물 삭제 〉
              </EditBtn>
              <EditBtn
                onClick={() => onClickEdit({ id: item.id, ...editData })}
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
                <span style={{ color: '#1882FF' }}>
                  {item.clickCounter} view
                </span>
              </View>

              <EditBtn onClick={onClickEditToggle}>게시물 수정 〉</EditBtn>
            </>
          )}
        </TitleAndView>
        <CityAndTownAndAddress>
          <CityInput
            defaultValue={item.city}
            onChange={(e) => setEditCity(e.target.value)}
            // onChange={onClickEditTown}
          >
            <option value="제주전체">제주전체</option>
            <option value="제주시">제주시</option>
            <option value="서귀포시">서귀포시</option>
          </CityInput>
          <TownInput
            defaultValue={item.town}
            // onChange={(e) => setEditTown(e.target.value)}
            onChange={(e) => onClickEditTown(e)}
          >
            <option value="조천읍">조천읍</option>
            <option value="제주시">제주시</option>
            <option value="성산읍">성산읍</option>
            <option value="표선면">표선면</option>
            <option value="남원읍">남원읍</option>
            <option value="서귀포">서귀포</option>
            <option value="중문">중문</option>
            <option value="안덕면">안덕면</option>
            <option value="대정읍">대정읍</option>
            <option value="애월읍">애월읍</option>
            <option value="우도">우도</option>
            <option value="마라도">마라도</option>
          </TownInput>
          <Address>
            <Image src="/spot_icon.svg" alt="image" width={15} height={15} />{' '}
            <span>{item.address}</span>
            <span
              style={{
                marginLeft: 10,
                textDecoration: 'underLine',
                color: '#8E8E93',
                cursor: 'pointer',
              }}
            >
              copy
            </span>
          </Address>
        </CityAndTownAndAddress>
        <Content>
          Tip |{' '}
          <ContentInput
            defaultValue={item.content}
            onChange={(e) => {
              setEditContent(e.target.value);
            }}
          />
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
`;

const TitleAndView = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Title = styled.div`
  font-size: 30px;
  margin-right: 20px;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TitleInput = styled.input`
  font-size: 30px;
  margin-right: 20px;
  width: 90%;
`;

const View = styled.div`
  display: flex;
  align-items: center;
`;

const EditBtnCotainer = styled.div`
  display: flex;
  gap: 10px;
  width: 350px;
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
`;

const CityAndTownAndAddress = styled.div`
  display: flex;
  gap: 10px;
`;

const City = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 100%;
  height: 40px;
  text-align: center;
  padding-top: 4px;
`;

const CityInput = styled.select`
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 50%;
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
  width: 400px;
  height: 40px;
  text-align: center;
  padding-top: 4px;
`;

const TownInput = styled.select`
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 30%;
  height: 40px;
  text-align: center;
  border: none;
`;

const Address = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const AddressText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8f8f8;
  width: 97%;
  min-height: 50px;
  padding-left: 20px;
  color: #8e8e93;
  margin-bottom: 5px;
`;

const ContentInput = styled.input`
  width: 80%;
  min-height: 30px;
  padding-left: 10px;
  margin-left: 20px;
  border: transparent;
`;

const TipSpan = styled.span`
  width: 50px;
`;

const ContentSpan = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 20px;
  margin-right: 20px;
`;
