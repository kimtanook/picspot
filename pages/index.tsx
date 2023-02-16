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

export default function Main() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [selectCity, setSelectCity] = useState('');
  const [selectTown, setSelectTown] = useState('');
  const nowuser = authService.currentUser;

  // console.log(
  //   'authService?.currentUser?.displayName: ',
  //   authService?.currentUser?.displayName
  // );

  //* 게시물 작성 모달창
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

  const onChangeSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
    visibleReset();
    setSelectCity(event.target.value);
  };
  const onChangeSelectTown = (event: ChangeEvent<HTMLSelectElement>) => {
    visibleReset();
    setSelectTown(event.target.value);
  };

  // 무한 스크롤
  const {
    data, // data.pages를 갖고 있는 배열
    fetchNextPage, // 다음 페이지를 불러오는 함수
    status, // loading, error, success 중 하나의 상태, string
  } = useInfiniteQuery(
    ['infiniteData', selectTown, selectCity], // data의 이름
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
    visibleReset();
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
          <MypageButton hidden={!currentUser}>마이페이지</MypageButton>
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
      <input />
      <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
        <Categories onChange={onChangeSelectCity}>
          <option value="">지역전체</option>
          <option value="제주시">제주시</option>
          <option value="서귀포시">서귀포시</option>
        </Categories>
        {selectCity === '제주시' ? (
          <Categories onChange={onChangeSelectTown}>
            <option value="">읍면동전체</option>
            <option value="애월읍">애월읍</option>
            <option value="남원읍">남원읍</option>
          </Categories>
        ) : selectCity === '서귀포시' ? (
          <Categories onChange={onChangeSelectTown}>
            <option value="">읍면동전체</option>
            <option value="표선면">표선면</option>
            <option value="대정읍">대정읍</option>
          </Categories>
        ) : (
          <Categories onChange={onChangeSelectTown}>
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
      <div></div>
      {/* <SearchPlace /> */}
      <div>
        <ImageBox>
          <Image
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
          <Image
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
          <Image
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
          <Image
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
          <Image
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
        </ImageBox>
        {/* 아래는 무한 스크롤 테스트 코드입니다. 차후, 메인페이지 디자인에 따라 바뀔 예정입니다. */}
        {status === 'loading' ? (
          <div>로딩중입니다.</div>
        ) : (
          <div>
            <GridBox>
              {data?.pages.map((data) =>
                data.map((item: any) => (
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
