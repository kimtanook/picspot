import Header from '@/components/Header';
import Modal from '@/components/main/Modal';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
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
import DataLoading from '@/components/common/DataLoading';
import DataError from '@/components/common/DataError';
import ModalLogin from '@/components/ModalLogin';
import TownSelect from '@/components/main/TownSelect';

export default function Main() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [closeLoginModal, setCloseLoginModal]: any = useState(false);
  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectCity, setSelectCity] = useState('');
  const [selectTown, setSelectTown] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);

  const [isModalPostActive, setIsModalPostActive]: any = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (isModalActive || isModalPostActive) {
      html.style.overflowY = 'hidden';
      html.style.overflowX = 'hidden';
    } else {
      html.style.overflowY = 'auto';
      html.style.overflowX = 'auto';
    }
    return () => {
      html.style.overflowY = 'auto';
      html.style.overflowX = 'auto';
    };
  }, [isModalActive, isModalPostActive]);

  const onClickToggleMapModal = () => {
    setIsModalActive(!isModalActive);
  };

  const onClickTogglePostModal = () => {
    if (!authService.currentUser) {
      setCloseLoginModal(true);
      return;
    }
    if (authService.currentUser) {
      setIsModalPostActive(true);
      return;
    }
    // setIsModalPostActive(!isModalPostActive);
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
    setSelectTown([]);
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
    setSelectTown([]);
    setSearchValue('');
    visibleReset();
    router.push({
      pathname: '/main',
      query: { city: event.target.value },
    });
    setSelectCity(event.target.value);
  };
  // [카테고리] 타운 카테고리 onClick
  const onClickSelectTown = (event: MouseEvent<HTMLButtonElement>) => {
    setSearchValue('');
    visibleReset();
    const townName = event.currentTarget.value as never;
    if (!selectTown.includes(townName)) {
      setSelectTown([...selectTown, townName]);
    } else {
      const cancelSelect = selectTown.filter(
        (item: string) => item !== event.currentTarget.value
      );
      setSelectTown(cancelSelect);
    }
  };
  const onChangeSelectTown = (event: MouseEvent<HTMLButtonElement>) => {
    setSearchValue('');
    visibleReset();
    const townName = event.currentTarget.value as never;
    setSelectTown([townName]);
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
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
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
    <Wrap>
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
        <SelectContainer>
          {router.route === '/main' ? (
            <CityCategory value={selectCity} onChange={onChangeSelectCity}>
              <option value="제주전체">제주전체</option>
              <option value="제주시">제주시</option>
              <option value="서귀포시">서귀포시</option>
            </CityCategory>
          ) : null}
          <CategoriesWrap>
            <TownCategory>
              <TownSelect
                selectCity={selectCity}
                selectTown={selectTown}
                onClickSelectTown={onClickSelectTown}
                onChangeSelectTown={onChangeSelectTown}
              />
            </TownCategory>
          </CategoriesWrap>
        </SelectContainer>
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
            <DataLoading />
          ) : status === 'error' ? (
            <DataError />
          ) : (
            <GridBox>
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 425: 2, 700: 3, 1200: 4 }}
              >
                <Masonry columnsCount={4}>
                  {data?.pages.map((data) =>
                    data?.map((item: { [key: string]: string }) => (
                      <ItemBox key={uuidv4()}>
                        <Content item={item} />
                      </ItemBox>
                    ))
                  )}
                </Masonry>
              </ResponsiveMasonry>
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
            width="1100"
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
            element={
              <ModalMaps selectTown={selectTown} selectCity={selectCity} />
            }
          />
        ) : (
          ''
        )}

        {closeLoginModal ? (
          <CustomModal
            modal={closeLoginModal}
            setModal={setCloseLoginModal}
            width="1000"
            height="1000"
            element={<ModalLogin closeLoginModal={setCloseLoginModal} />}
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
    </Wrap>
  );
}
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  @media ${(props) => props.theme.mobile} {
    width: 375px;
  }
`;
const MainContainer = styled.div`
  @media ${(props) => props.theme.mobile} {
    margin: auto;
    display: flex;
    flex-direction: column;
    width: 375px;
  }
`;
const CityCategory = styled.select`
  display: none;
  @media ${(props) => props.theme.mobile} {
    margin: auto;
    display: inherit;
    text-align: center;
    background-color: inherit;
    font-size: 14px;
    border: none;
    width: 70px;
    height: 21px;
  }
`;
const SelectContainer = styled.div`
  @media ${(props) => props.theme.mobile} {
    display: flex;
    margin: auto;
    width: 150px;
  }
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
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
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

const GridBox = styled.div`
  margin: auto;
  width: 1188px;
  @media ${(props) => props.theme.mobile} {
    width: 375px;
  }
`;
const ItemBox = styled.div`
  margin: 0px 5px 20px 5px;
`;
const ChatWrap = styled.div`
  position: fixed;
  left: 3%;
  top: 90%;
  transform: translate(-50%, -50%);
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
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
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    height: 60px;
    margin: auto;
    left: 0;
    bottom: 0;
    border-radius: inherit;
    font-size: 14px;
  }
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
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
