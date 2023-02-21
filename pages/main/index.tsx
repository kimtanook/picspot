// import HomeCategory from './HomeCategory';
// import HomePost from './HomePost';
import Header from '@/components/Header';
import Modal from '@/components/main/Modal';
import { v4 as uuidv4 } from 'uuid';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Seo from '@/components/Seo';
import Chat from '@/components/chat/Chat';
import { useInfiniteQuery } from 'react-query';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { getInfiniteData, visibleReset } from '@/api';
import Content from '@/components/main/Content';
import { authService } from '@/firebase';
import { useRouter } from 'next/router';
import Search from '@/components/main/Search';
import { CustomModal } from '@/components/common/CustomModal';
import ModalMaps from '@/components/detail/ModalMaps';

export default function Main() {
  // console.log('authService.currentUser?.uid: ', authService.currentUser?.uid);

  const [isOpenModal, setOpenModal] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [searchOption, setSearchOption] = useState('userName');
  const [searchValue, setSearchValue] = useState('');
  const [selectCity, setSelectCity] = useState('');
  const [selectTown, setSelectTown] = useState('');
  const [isModalActive, setIsModalActive] = useState(false);
  const onClickToggleMapModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);
  const router = useRouter();
  const nowUser = authService.currentUser;

  const onClickToggleModal = () => {
    if (!authService.currentUser) {
      setCloseLoginModal(!closeLoginModal);
      return;
    }
    if (authService.currentUser) {
      setOpenModal(!isOpenModal);
    }
  };

  const onClickChatToggle = () => {
    if (!authService.currentUser) {
      alert('로그인을 해주세요.');
      return;
    }
    if (
      chatToggle &&
      confirm('닫으시면 지금까지의 대화내용이 사라집니다. 닫으시겠습니까?')
    ) {
      return setChatToggle(false);
    }
    setChatToggle(true);
  };

  const searchOptionRef = useRef() as React.MutableRefObject<HTMLSelectElement>;

  // [검색] 유저가 고르는 옵션(카테고리)과, 옵션을 고른 후 입력하는 input
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectCity('제주전체');
    setSelectTown('');
    visibleReset();
    setSearchOption(searchOptionRef.current?.value);
    setSearchValue(event.target.value);
    router.push({
      pathname: '/main',
      query: { city: '제주전체' },
    });
  };

  // [카테고리] 지역 카테고리 onChange
  const onChangeSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectTown('');
    setSearchValue('');
    visibleReset();
    router.push({
      pathname: '/main',
      query: { city: event.target.value },
    });
    setSelectCity(event.target.value);
  };
  // [카테고리] 타운 카테고리 onChange
  const onChangeSelectTown = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchValue('');
    visibleReset();
    setSelectTown(event.target.value);
  };

  // 무한 스크롤
  const {
    data, // data.pages를 갖고 있는 배열
    fetchNextPage, // 다음 페이지를 불러오는 함수
    status, // loading, error, success 중 하나의 상태, string
  } = useInfiniteQuery(
    ['infiniteData', searchOption, searchValue, selectTown, selectCity], // data의 이름
    getInfiniteData, // fetch callback, 위 data를 불러올 함수
    {
      getNextPageParam: () => {
        return true;
      },
    }
  );
  // 스크롤이 바닥을 찍으면 발생하는 이벤트
  useBottomScrollListener(() => {
    fetchNextPage();
  });

  useEffect(() => {
    if (authService.currentUser) {
      setCurrentUser(true);
    }
    setSelectCity(`${router.query.city}`);
    visibleReset();
    setChatToggle(false);
  }, [nowUser, router]);

  return (
    <MainContainer>
      <Seo title="Home" />
      <MainHeaderdiv>
        <Header />
        <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
          <Categories value={selectCity} onChange={onChangeSelectCity}>
            <option value="제주전체">제주전체</option>
            <option value="제주시">제주시</option>
            <option value="서귀포시">서귀포시</option>
          </Categories>
          {selectCity === '제주시' ? (
            <Categories value={selectTown} onChange={onChangeSelectTown}>
              <option value="">읍면동전체</option>
              <option value="애월읍">애월읍</option>
              <option value="남원읍">남원읍</option>
            </Categories>
          ) : selectCity === '서귀포시' ? (
            <Categories value={selectTown} onChange={onChangeSelectTown}>
              <option value="">읍면동전체</option>
              <option value="표선면">표선면</option>
              <option value="대정읍">대정읍</option>
            </Categories>
          ) : (
            <Categories value={selectTown} onChange={onChangeSelectTown}>
              <option value="">읍면동전체</option>
              <option value="표선면">표선면</option>
              <option value="대정읍">대정읍</option>
              <option value="애월읍">애월읍</option>
              <option value="남원읍">남원읍</option>
            </Categories>
          )}
          <Categories>지역</Categories>
          <Categories>팔로우</Categories>
        </div>

        <Search
          searchOptionRef={searchOptionRef}
          searchValue={searchValue}
          onChangeSearchValue={onChangeSearchValue}
        />
        <PostFormButton onClick={onClickToggleModal}>
          + 나의 스팟 추가
        </PostFormButton>
      </MainHeaderdiv>
      <MainBodydiv>
        {isOpenModal && (
          <Modal
            onClickToggleModal={onClickToggleModal}
            setOpenModal={setOpenModal}
          >
            <div>children</div>
          </Modal>
        )}

        <h1>{selectCity === 'undefined' ? '로딩중입니다.' : selectCity}</h1>
        <div>
          {/* 아래는 무한 스크롤 테스트 코드입니다. 차후, 메인페이지 디자인에 따라 바뀔 예정입니다. */}
          {status === 'loading' ? (
            <div>로딩중입니다.</div>
          ) : status === 'error' ? (
            <div>데이터를 불러오지 못했습니다.</div>
          ) : (
            <div>
              <GridBox>
                {data?.pages.map((data) =>
                  data?.map((item: any) => (
                    <ItemBox key={uuidv4()}>
                      <Content item={item} />
                    </ItemBox>
                  ))
                )}
              </GridBox>
            </div>
          )}

          <ChatWrap>
            <div>{chatToggle ? <Chat /> : null}</div>
            <ChatToggleBtn onClick={onClickChatToggle}>
              {chatToggle ? '닫기' : '열기'}
            </ChatToggleBtn>
          </ChatWrap>
        </div>
        <MapModalBtn onClick={onClickToggleMapModal}>
          지도에서 핀 보기
        </MapModalBtn>

        {isModalActive ? (
          <CustomModal
            modal={isModalActive}
            setModal={setIsModalActive}
            width="1200"
            height="700"
            element={<ModalMaps />}
          />
        ) : (
          ''
        )}
      </MainBodydiv>
    </MainContainer>
  );
}

const MainContainer = styled.div``;

const MainHeaderdiv = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
`;

const PostFormButton = styled.button`
  border-radius: 20px;
  color: cornflowerblue;
  border: 1px solid cornflowerblue;
  background-color: none;
  width: 130px;
  height: 25px;
  cursor: pointer;
`;

const MainBodydiv = styled.div``;

const Categories = styled.select`
  background-color: tomato;
  width: 100px;
  height: 40px;
`;

const GridBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 100px;
  margin: 10px;
`;
const ItemBox = styled.div`
  background-color: pink;
  height: 250px;
  margin: 10px;
`;
const ChatWrap = styled.div`
  /* background-color: red; */
  position: fixed;
  left: 80%;
  top: 70%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 520px;
`;
const ChatToggleBtn = styled.button`
  position: fixed;
  background-color: cornflowerblue;
  left: 90%;
  top: 90%;
  border-radius: 50%;
  border: none;
  width: 50px;
  height: 50px;
`;

const MapModalBtn = styled.button`
  background-color: cornflowerblue;
  border: 0px;
  border-radius: 7px;
  padding: 5px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  position: fixed;
  bottom: 10px;
  width: 100px;
  right: 50%;
  left: 50%;
`;
