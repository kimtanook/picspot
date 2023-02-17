import Modal from '@/components/main/Modal';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalLogin from '@/components/ModalLogin';
import Seo from '@/components/Seo';
import Chat from '@/components/chat/Chat';
import { useInfiniteQuery } from 'react-query';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { getInfiniteData, visibleReset } from '@/api';
import Content from '@/components/main/Content';
import { authService } from '@/firebase';
import { signOut } from 'firebase/auth';
import { customAlert } from '@/utils/alerts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Search from '@/components/main/Search';

export default function Main() {
  const router = useRouter();
  const [isOpenModal, setOpenModal] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [searchOption, setSearchOption] = useState('userName');
  const [searchValue, setSearchValue] = useState('');
  const [selectCity, setSelectCity] = useState(`${router.query.city ?? ''}`);
  const [selectTown, setSelectTown] = useState('');
  const nowuser = authService.currentUser;
  console.log('selectCity : ', selectCity);
  const onClickToggleModal = () => {
    if (!authService.currentUser) {
      setCloseModal(!closeModal);
      return;
    }
    if (authService.currentUser) {
      setOpenModal(!isOpenModal);
    }
  };

  const onClickChatToggle = () => {
    setChatToggle(!chatToggle);
  };
  // 로그인 모달 창 버튼
  const closeModalButton = () => {
    setCloseModal(!closeModal);
  };

  // 로그아웃
  const logOut = () => {
    signOut(authService).then(() => {
      // Sign-out successful.
      localStorage.clear();
      setCurrentUser(false);
      customAlert('로그아웃에 성공하였습니다!');
    });
  };
  // [검색] 유저가 검색할 때 고르는 옵션(카테고리) (닉네임 또는 제목)
  const onChangeSearchOption = (event: ChangeEvent<HTMLSelectElement>) => {
    visibleReset();
    setSearchOption(event.target.value);
  };
  // [검색] 유저가 옵션(카테고리)을 고른 후 입력하는 input
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    visibleReset();
    setSelectCity('');
    setSelectTown('');
    setSearchValue(event.target.value);
  };

  // [카테고리] 지역 카테고리 onChange
  const onChangeSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectTown('');
    setSearchValue('');
    visibleReset();
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
    // routeChangeComplete = 주소가 완전히 변경되면 실행되는 이벤트
    router.events.on('routeChangeComplete', visibleReset);
    if (authService.currentUser) {
      setCurrentUser(true);
    }
  }, [nowuser]);

  return (
    <>
      <div>
        <Seo title="Home" />
        {/* 로그인, 로그아웃 버튼 */}
        {closeModal && <ModalLogin closeModal={closeModalButton} />}
        {currentUser ? (
          <LoginButton onClick={logOut}>로그아웃</LoginButton>
        ) : (
          <LoginButton onClick={closeModalButton}>로그인</LoginButton>
        )}
        {/* 마이페이지 버튼 */}
        <Link href={'/mypage'}>
          {authService.currentUser?.displayName
            ? `${authService.currentUser?.displayName}의 프로필`
            : '프로필'}
        </Link>
      </div>
      {isOpenModal && (
        <Modal
          onClickToggleModal={onClickToggleModal}
          setOpenModal={setOpenModal}
        >
          <div>children</div>
        </Modal>
      )}
      <Search
        searchValue={searchValue}
        onChangeSearchOption={onChangeSearchOption}
        onChangeSearchValue={onChangeSearchValue}
      />
      <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
        <Categories value={selectCity} onChange={onChangeSelectCity}>
          <option value="">제주전체</option>
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
        <PostFormButton onClick={onClickToggleModal}>
          게시물 작성
        </PostFormButton>
      </div>
      <h1>{!selectCity ? '제주 전체' : selectCity}</h1>
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

        {chatToggle ? <Chat /> : null}
        <ChatToggleBtn onClick={onClickChatToggle}>
          {chatToggle ? '닫기' : '열기'}
        </ChatToggleBtn>
        {/* <SearchPlace /> */}
      </div>
    </>
  );
}
const LoginButton = styled.button``;
const MypageButton = styled.button``;

const Categories = styled.select`
  background-color: tomato;
  width: 100px;
  height: 40px;
`;
const PostFormButton = styled.button`
  background-color: tomato;
  width: 100px;
  height: 40px;
`;

const ImageBox = styled.div`
  border: tomato 1px solid;
  display: flex;
  flex-direction: row;
`;
const GridBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 100px;
  margin: 10px;
`;
const ItemBox = styled.div`
  background-color: aqua;
  height: 250px;
  margin: 10px;
`;
const ChatToggleBtn = styled.button`
  position: fixed;
  background-color: aqua;
  left: 90%;
  top: 90%;
  border-radius: 50%;
  border: none;

  width: 50px;
  height: 50px;
`;
