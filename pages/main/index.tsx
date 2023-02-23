import Header from '@/components/Header';
import Modal from '@/components/main/Modal';
import Masonry from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import PostForm from '@/components/main/PostForm';
import ModalLogin from '@/components/ModalLogin';
import Loading from '@/components/common/Loading';

export default function Main() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useState(false);
  const [searchOption, setSearchOption] = useState('userName');
  const [searchValue, setSearchValue] = useState('');
  const [selectCity, setSelectCity] = useState('');
  const [selectTown, setSelectTown] = useState('');
  const [isModalActive, setIsModalActive] = useState(false);
  const [isModalPostActive, setIsModalPostActive]: any = useState(false);
  const onClickToggleMapModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  // const onClickTogglePostModal = useCallback(() => {
  //   setIsModalPostActive(!isModalPostActive);
  // }, [isModalPostActive]);

  const onClickTogglePostModal = () => {
    setIsModalPostActive(true);
  };
  const router = useRouter();

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
  const onClickSelectTown = (event: MouseEvent<HTMLButtonElement>) => {
    setSearchValue('');
    visibleReset();
    setSelectTown(event.currentTarget.value);
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
  // 스크롤이 바닥을 찍으면 발생하는 이벤트. offset으로 바닥에서 offset값 픽셀 직전에 실행시킬 수 있다.
  useBottomScrollListener(fetchNextPage, { offset: 300 });

  useEffect(() => {
    setSelectCity(`${router.query.city}`);
    visibleReset();
    setChatToggle(false);
  }, [router]);

  return (
    <>
      <Seo title="Home" />
      <Header selectCity={selectCity} onChangeSelectCity={onChangeSelectCity} />
      <MainContainer>
        <SearchAndForm>
          <PostFormButton onClick={onClickTogglePostModal}>
            + 나의 스팟 추가
          </PostFormButton>

          <Search
            searchOptionRef={searchOptionRef}
            searchValue={searchValue}
            onChangeSearchValue={onChangeSearchValue}
          />
        </SearchAndForm>

        <CategoriesWrap>
          <TownCategory>
            {selectCity === '제주시' ? (
              <div>
                <TownBtn onClick={onClickSelectTown} value="">
                  제주시
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="구좌읍">
                  구좌읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="애월읍">
                  애월읍
                </TownBtn>

                <TownBtn onClick={onClickSelectTown} value="우도면">
                  우도면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="추자면">
                  추자면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="한경면">
                  한경면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="한림읍">
                  한림읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="조천읍">
                  조천읍
                </TownBtn>
              </div>
            ) : selectCity === '서귀포시' ? (
              <div>
                <TownBtn onClick={onClickSelectTown} value="">
                  서귀포시
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="표선면">
                  표선면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="대정읍">
                  대정읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="성산읍">
                  성산읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="안덕면">
                  안덕면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="남원읍">
                  남원읍
                </TownBtn>
              </div>
            ) : (
              <div>
                <TownBtn onClick={onClickSelectTown} value="">
                  제주전체
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="구좌읍">
                  구좌읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="표선면">
                  표선면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="대정읍">
                  대정읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="애월읍">
                  애월읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="남원읍">
                  남원읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="성산읍">
                  성산읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="안덕면">
                  안덕면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="우도면">
                  우도면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="추자면">
                  추자면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="한경면">
                  한경면
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="한림읍">
                  한림읍
                </TownBtn>
                <TownBtn onClick={onClickSelectTown} value="조천읍">
                  조천읍
                </TownBtn>
              </div>
            )}
          </TownCategory>
        </CategoriesWrap>

        {isOpenModal && (
          <Modal
            onClickToggleModal={onClickToggleModal}
            setOpenModal={setOpenModal}
          >
            <div>children</div>
          </Modal>
        )}

        {isOpenModal && (
          <Modal
            onClickToggleModal={onClickToggleModal}
            setOpenModal={setOpenModal}
          >
            <div>children</div>
          </Modal>
        )}
        <div>
          {/* 무한 스크롤 */}
          {status === 'loading' ? (
            <Loading />
          ) : status === 'error' ? (
            <div>데이터를 불러오지 못했습니다.</div>
          ) : (
            <GridBox>
              <Masonry columnsCount={4}>
                {data?.pages.map((data) =>
                  data?.map((item: any) => (
                    <ItemBox key={uuidv4()}>
                      <Content item={item} />
                    </ItemBox>
                  ))
                )}
              </Masonry>
            </GridBox>
          )}

          <ChatWrap>
            <div>{chatToggle ? <Chat /> : null}</div>
            <ChatToggleBtn onClick={onClickChatToggle}>
              {chatToggle ? (
                '닫기'
              ) : (
                <ChatLogoWrap>
                  <ChatLogo src="/chat-logo.png" />
                </ChatLogoWrap>
              )}
            </ChatToggleBtn>
          </ChatWrap>
        </div>

        {isModalPostActive ? (
          <CustomModal
            modal={isModalPostActive}
            setModal={setIsModalPostActive}
            width="1080"
            height="632"
            element={<PostForm setIsModalPostActive={setIsModalPostActive} />}
          />
        ) : (
          ''
        )}
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

        <MapModalBtn onClick={onClickToggleMapModal}>
          <div>
            <PinImg src="/pin.png" />
          </div>
          <div>지도에서 핀 보기</div>
        </MapModalBtn>

        <TopBtn
          onClick={() => scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        >
          TOP
        </TopBtn>
      </MainContainer>
    </>
  );
}

const MainContainer = styled.div`
  /* width: 1440px;
  margin: auto; */
`;

const SearchAndForm = styled.div`
  display: flex;
  position: absolute;
  top: 16px;
  left: 70px;
  flex-direction: row-reverse;
  align-items: center;
  margin-top: 10px;
  margin-left: 55%;
  width: 440px;
`;
const PostFormButton = styled.button`
  border-radius: 20px;
  color: #1882ff;
  border: 1px solid cornflowerblue;
  background-color: white;
  cursor: pointer;
  width: 121.16px;
  height: 31px;
`;

const CategoriesWrap = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

const TownCategory = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;
const TownBtn = styled.button`
  background-color: #dcdcdc;
  width: 66px;
  height: 26px;
  margin: 3px;
  border: none;
  border-radius: 52px;
  cursor: pointer;
`;

const GridBox = styled.div`
  margin: auto;
  width: 1188px;
`;
const ItemBox = styled.div`
  margin: 0px 5px 20px 5px;
`;
const ChatWrap = styled.div`
  position: fixed;
  left: 3%;
  top: 90%;
  transform: translate(-50%, -50%);
`;
const ChatToggleBtn = styled.button`
  position: fixed;
  background-color: inherit;
  border: 3px solid #1882ff;
  left: 5%;
  top: 90%;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
`;

const MapModalBtn = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #1882ff;
  border-radius: 52px;
  color: #1882ff;
  font-weight: 700;
  cursor: pointer;
  position: fixed;
  width: 121px;
  height: 36px;
  left: calc(50% - 121px / 2 - 0.5px);
  bottom: 42px;
`;
const PinImg = styled.img`
  margin-right: 3px;
`;
const ChatLogoWrap = styled.div`
  display: flex;
  justify-content: center;
`;
const ChatLogo = styled.img`
  width: 40px;
  height: 40px;
`;
const TopBtn = styled.button`
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background-color: #feb819;
  color: white;
  position: fixed;
  top: 90%;
  left: 85%;
  cursor: pointer;
  transition: 0.3s;
  :hover {
    background-color: #fed474;
  }
`;
