import Header from '@/components/Header';
import Modal from '@/components/main/Modal';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';
import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import Seo from '@/components/Seo';
import Chat from '@/components/chat/Chat';
import { useInfiniteQuery } from 'react-query';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { getInfiniteData, visibleReset } from '@/api';
import { authService } from '@/firebase';
import { useRouter } from 'next/router';
import { CustomModalMainMap } from '@/components/common/CustomModalMainMap';
import ModalMaps from '@/components/detail/ModalMaps';
import DataLoading from '@/components/common/DataLoading';
import DataError from '@/components/common/DataError';
import { loginModalAtom, postModalAtom, townArray } from '../../atom';
import TownSelect from '@/components/main/TownSelect';
import { customAlert } from '@/utils/alerts';
import { useRecoilState } from 'recoil';
import { useMediaQuery } from 'react-responsive';
import { logEvent } from '@/utils/amplitude';
import { debounce } from 'lodash';
import Image from 'next/image';
import ContentBox from '@/components/main/ContentBox';

export default function Main() {
  const router = useRouter();
  const selectCity = router.query.city;
  const [isOpenModal, setOpenModal] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useRecoilState(loginModalAtom);
  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectTown, setSelectTown] = useRecoilState(townArray);
  const [isModalActive, setIsModalActive] = useState(false);
  const [postMapModal, setIsPostMapModal] = useRecoilState(postModalAtom);

  const isPc = useMediaQuery({ minWidth: 824 });

  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({ maxWidth: 823 });

  // 반응형 모바일 작업 시, 모달 지도 사이즈 줄이기
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);

  const onClickToggleMapModal = () => {
    setIsModalActive(!isModalActive);
  };

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
      customAlert('로그인을 해주세요.');
      setCloseLoginModal(!closeLoginModal);
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

  // [검색] onChange debounce
  const debounceOnChange = useMemo(
    () => debounce((e) => setSearchValue(e), 500),
    []
  );

  // [검색] 유저가 고르는 옵션(카테고리)과, 옵션을 고른 후 입력하는 input
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectTown([]);
    visibleReset();
    setSearchOption(searchOptionRef.current?.value);
    debounceOnChange(event.target.value);
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
  };
  // [카테고리] 타운 카테고리 onClick
  const onClickSelectTown = async (event: MouseEvent<HTMLButtonElement>) => {
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

  // 뒤로가기로 메인 페이지 진입 시 스크롤 위치 복원 및 삭제
  const scrollRevert = () => {
    window.scrollTo(0, Number(sessionStorage.getItem('scrollY')));
    sessionStorage.removeItem('scrollY');
  };

  useEffect(() => {
    // 무한스크롤로 인해 스크롤 복원 시 제대로 된 위치로 가지 않아서 임시로 setTimeout 사용
    setTimeout(() => scrollRevert(), 300);
    setChatToggle(false);
  }, []);

  //* Amplitude 이벤트 생성
  useEffect(() => {
    logEvent('메인 페이지', { from: 'main page' });
  }, []);

  // 뒷 배경 스크롤 방지
  useEffect(() => {
    const html = document.documentElement;
    if (isModalActive || postMapModal) {
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
  }, [isModalActive, postMapModal]);

  return (
    <Wrap>
      <Seo title="Home" />

      <Header
        selectCity={selectCity}
        onChangeSelectCity={onChangeSelectCity}
        searchOptionRef={searchOptionRef}
        searchValue={searchValue}
        onChangeSearchValue={onChangeSearchValue}
      />

      <MainContainer>
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
              {data?.pages[0]?.length === 0 ? (
                <EmptyPostBox>
                  <Image
                    src="/main/empty-icon.png"
                    alt="empty-icon"
                    className="empty-image"
                    width={100}
                    height={100}
                  />
                  <div>게시글이 없습니다.</div>
                </EmptyPostBox>
              ) : (
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 425: 2, 700: 3, 1200: 4 }}
                >
                  <Masonry columnsCount={4}>
                    {data?.pages.map((data) =>
                      data?.map((item: { [key: string]: string }) => (
                        <ContentBox key={uuidv4()} item={item} />
                      ))
                    )}
                  </Masonry>
                </ResponsiveMasonry>
              )}
            </GridBox>
          )}

          <ChatWrap>
            <div>{chatToggle ? <Chat /> : null}</div>
            <ChatToggleBtn onClick={onClickChatToggle}>
              {chatToggle ? (
                '닫기'
              ) : (
                <ChatLogoWrap>
                  <ChatLogeBox>
                    {/* <ChatLogo src="/chat-logo.png" /> */}
                    <Image src="/chat-logo.png" alt="chatLogo" layout="fill" />
                  </ChatLogeBox>
                </ChatLogoWrap>
              )}
            </ChatToggleBtn>
          </ChatWrap>
        </div>

        {isMobile && (
          <>
            {isModalActive ? (
              <CustomModalMainMap
                modal={isModalActive}
                setModal={setIsModalActive}
                width="500"
                height="-20"
                element={
                  <>
                    <ModalMapsWrap>
                      <ModalMaps />
                      <ModalMapsBackButton
                        onClick={() => {
                          setIsModalActive(!isModalActive);
                        }}
                      >
                        <MobileCancle src="/Back-point.png" />
                      </ModalMapsBackButton>
                    </ModalMapsWrap>
                  </>
                }
              />
            ) : (
              ''
            )}
          </>
        )}

        {isPc && (
          <>
            {isModalActive ? (
              <CustomModalMainMap
                modal={isModalActive}
                setModal={setIsModalActive}
                width="500"
                height="500"
                element={
                  <>
                    <ModalMapsWrap>
                      <ModalMaps />
                      <ModalMapsBackButton
                        onClick={() => {
                          setIsModalActive(!isModalActive);
                        }}
                      ></ModalMapsBackButton>
                    </ModalMapsWrap>
                  </>
                }
              />
            ) : (
              ''
            )}
          </>
        )}

        <MapModalBtn onClick={onClickToggleMapModal}>
          <div>
            <PinImgBox>
              <Image src="/pin.png" alt="pinImg" layout="fill" />
            </PinImgBox>
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
  /* margin: auto; */
  width: 100vw;
`;

const MainContainer = styled.div`
  @media ${(props) => props.theme.mobile} {
    margin: auto;
    display: flex;
    flex-direction: column;
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
    flex-direction: column;
    margin: auto;
  }
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
  width: 80%;
  @media ${(props) => props.theme.mobile} {
    width: 375px;
  }
`;

const EmptyPostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  & > .empty-image {
    width: 100%;
    height: 100%;
  }
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
  z-index: 999;
  &:hover {
    background-color: #1882ff;
    color: white;
  }
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    height: 60px;
    margin: auto;
    left: 0;
    bottom: 0;
    border-radius: inherit;
    font-size: 14px;
    z-index: 999;
  }
`;
const PinImgBox = styled.div`
  position: relative;
  margin-right: 3px;
`;
const PinImg = styled.img`
  margin-right: 3px;
`;
const ChatLogoWrap = styled.div`
  display: flex;
  justify-content: center;
`;
const ChatLogeBox = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
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

const PostFormWrap = styled.div`
  @media ${(props) => props.theme.mobile} {
    width: 375px;
    height: 1240px;
    overflow: hidden;
  }
`;

const ModalMapsWrap = styled.div`
  @media ${(props) => props.theme.mobile} {
    position: relative;
    display: flex;
  }
`;
const ModalMapsBackButton = styled.div`
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    z-index: 1000;
    top: 5vw;
    left: 3vh;
  }
`;

const MobileCancle = styled.img``;
