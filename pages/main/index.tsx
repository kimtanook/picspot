import Header from '@/components/Header';
import Modal from '@/components/main/Modal';
import { v4 as uuidv4 } from 'uuid';
import {
  ChangeEvent,
  MouseEvent,
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

export default function Main() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useState(false);
  const [searchOption, setSearchOption] = useState('userName');
  const [searchValue, setSearchValue] = useState('');
  const [selectCity, setSelectCity] = useState('');
  const [selectTown, setSelectTown] = useState('');
  const [isModalActive, setIsModalActive] = useState(false);
  const onClickToggleMapModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);
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
  // 스크롤이 바닥을 찍으면 발생하는 이벤트
  useBottomScrollListener(() => {
    fetchNextPage();
  });

  useEffect(() => {
    setSelectCity(`${router.query.city}`);
    visibleReset();
    setChatToggle(false);
  }, [router]);

  return (
    <MainContainer>
      <Seo title="Home" />
      <CityCategoryWrap>
        <CityCategory value={selectCity} onChange={onChangeSelectCity}>
          <option value="제주전체">제주전체</option>
          <option value="제주시">제주시</option>
          <option value="서귀포시">서귀포시</option>
        </CityCategory>
      </CityCategoryWrap>
      <Header />
      <MainHeaderdiv>
        <SearchAndForm>
          <PostFormButton onClick={onClickToggleModal}>
            + 나의 스팟 추가
          </PostFormButton>
          <Search
            searchOptionRef={searchOptionRef}
            searchValue={searchValue}
            onChangeSearchValue={onChangeSearchValue}
          />
        </SearchAndForm>
      </MainHeaderdiv>
      <CategoriesWrap>
        <TownCategory>
          {selectCity === '제주시' ? (
            <div>
              <TownBtn onClick={onClickSelectTown} value="애월읍">
                애월읍
              </TownBtn>
              <TownBtn onClick={onClickSelectTown} value="남원읍">
                남원읍
              </TownBtn>
            </div>
          ) : selectCity === '서귀포시' ? (
            <div>
              <TownBtn onClick={onClickSelectTown} value="표선면">
                표선면
              </TownBtn>
              <TownBtn onClick={onClickSelectTown} value="대정읍">
                대정읍
              </TownBtn>
            </div>
          ) : (
            <div>
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

      <div>
        {/* 무한 스크롤 */}
        {status === 'loading' ? (
          <div>로딩중입니다.</div>
        ) : status === 'error' ? (
          <div>데이터를 불러오지 못했습니다.</div>
        ) : (
          <GridBox>
            {data?.pages.map((data) =>
              data?.map((item: any) => (
                <ItemBox key={uuidv4()}>
                  <Content item={item} />
                </ItemBox>
              ))
            )}
          </GridBox>
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
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width: 1440px;
  margin: auto;
`;

const MainHeaderdiv = styled.div`
  position: relative;
  width: 1440px;
`;
const SearchAndForm = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-left: 65%;
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
  z-index: 101;
`;

const CategoriesWrap = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;
const CityCategoryWrap = styled.div`
  width: 1440px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CityCategory = styled.select`
  font-size: 24px;
  border: none;
  border-radius: 20px;
  height: 40px;
  z-index: 100;
`;
const TownCategory = styled.div`
  margin-top: 40px;
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
  background-color: gray;
  margin-top: 80px;
  display: grid;
  grid-template-columns: repeat(4, 252px);
  justify-content: center;
`;
const ItemBox = styled.div`
  background-color: pink;
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
