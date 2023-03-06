import { authService } from '@/firebase';
import Link from 'next/link';
import { ChangeEventHandler, RefObject, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { loginModalAtom, messageBoxToggle, postModalAtom } from '@/atom';
import { getTakeMessage } from '@/api';
import { useQuery } from 'react-query';
import { customAlert } from '@/utils/alerts';
import Search from './main/Search';

const Header = ({
  selectCity,
  onChangeSelectCity,
  searchOptionRef,
  searchValue,
  onChangeSearchValue,
}: {
  selectCity: string | string[] | undefined;
  onChangeSelectCity: ChangeEventHandler<HTMLSelectElement> | undefined;
  searchValue: string;
  searchOptionRef: RefObject<HTMLSelectElement>;
  onChangeSearchValue: any;
}) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useRecoilState(loginModalAtom);
  const [msgToggle, setMsgToggle] = useRecoilState(messageBoxToggle);
  const [postMapModal, setIsPostMapModal] = useRecoilState(postModalAtom);
  const [userImg, setUserImg] = useState<string | null>(null);
  const [menuToggle, setMenuToggle] = useState(false);
  const router = useRouter();
  const nowUser = authService.currentUser;
  // 로그인 모달 창 버튼
  const closeLoginModalButton = () => {
    setCloseLoginModal(!closeLoginModal);
  };

  const onClickTogglePostModal = () => {
    if (!authService.currentUser) {
      customAlert('로그인을 해주세요.');
      setCloseLoginModal(true);
      return;
    }
    if (authService.currentUser) {
      setIsPostMapModal(true);
      return;
    }
  };

  // 쪽지함 버튼에 확인하지 않은 메세지 표시
  const { data: takeMsgData } = useQuery(
    ['getTakeMessageData', authService.currentUser?.uid],
    getTakeMessage,
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    }
  );
  const checked = takeMsgData?.filter((item) => item.checked === false);

  useEffect(() => {
    if (authService.currentUser) {
      setCurrentUser(true);
      setUserImg(authService.currentUser.photoURL);
    }
  }, [nowUser]);
  return (
    <HeaderContainer>
      {/* picspot */}
      <Link
        href="/main?city=제주전체"
        style={{ color: 'black', textDecorationLine: 'none' }}
      >
        <Title
          onClick={() => {
            // sessionStorage.clear();
            localStorage.clear();
          }}
        >
          <LogoImg src="/logo.png" alt="logo" />
        </Title>
      </Link>
      {router.route === '/main' ? (
        <CityCategory value={selectCity} onChange={onChangeSelectCity}>
          <option value="제주전체">제주전체</option>
          <option value="제주시">제주시</option>
          <option value="서귀포시">서귀포시</option>
        </CityCategory>
      ) : null}
      <SearchAndForm>
        <PostFormButton
          onClick={() => {
            onClickTogglePostModal();
          }}
        >
          + 나의 스팟 추가
        </PostFormButton>
        <SearchWrap>
          <Search
            searchOptionRef={searchOptionRef}
            searchValue={searchValue}
            onChangeSearchValue={onChangeSearchValue}
          />
        </SearchWrap>
      </SearchAndForm>
      <HeaderRight>
        {nowUser ? (
          <MessageImgWrap>
            <div>
              <Menu
                src="/menu.png"
                onClick={() => setMenuToggle(!menuToggle)}
              />
            </div>
            {menuToggle ? (
              <DropMenu>
                <PostFormButtonMobile
                  onClick={() => {
                    onClickTogglePostModal();
                  }}
                >
                  나의 스팟 추가
                </PostFormButtonMobile>
              </DropMenu>
            ) : null}
            <MessageWrap>
              <MessageImg
                onClick={() => setMsgToggle(true)}
                src="/message/message-icon.png"
              />
              {checked?.length === 0 ? null : (
                <CheckedCount>{checked?.length}</CheckedCount>
              )}
            </MessageWrap>
          </MessageImgWrap>
        ) : null}
        {/* 로그인, 로그아웃, 마이페이지 버튼 */}
        {currentUser ? (
          <div onClick={() => router.push('/mypage')}>
            {userImg ? (
              <ProfileImg src={userImg} alt="profile" />
            ) : (
              <ProfileImg src="/profileicon.svg" alt="profile" />
            )}
          </div>
        ) : (
          <div onClick={closeLoginModalButton}>
            <ProfileImg src="/profileicon.svg" alt="profile" />
          </div>
        )}
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  background-color: white;
  display: flex;
  width: 100vw;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  height: 70px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.08);
  padding: 0 32px 0 32px;
  @media ${(props) => props.theme.mobile} {
    height: 70px;
    box-shadow: none;
    padding: 0 16px 0 16px;
  }
`;
const Title = styled.div`
  width: 107px;
  font-weight: 900;
  font-size: 24px;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    margin-left: 12px;
    width: inherit;
  }
`;

const LogoImg = styled.img`
  width: 107px;
  height: 29px;
  @media ${(props) => props.theme.mobile} {
    width: 92px;
    height: 25px;
  }
`;

const CityCategory = styled.select`
  position: absolute;
  left: 50%;
  top: 4%;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: inherit;
  font-size: 24px;
  border: none;
  height: 40px;
  z-index: 1;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const SearchAndForm = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-top: 3px;
  margin-left: 53%;
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
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;

const SearchWrap = styled.div`
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const HeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  @media ${(props) => props.theme.mobile} {
  }
`;
const Menu = styled.img`
  display: none;
  @media ${(props) => props.theme.mobile} {
    display: inherit;
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;
const DropMenu = styled.div`
  background-color: #ffffff;
  width: 100px;
  height: 60px;
  border: 1px solid #1882ff;
  border-radius: 12px;
  position: absolute;
  left: 80%;
  top: 12%;
  transform: translate(-50%, -50%);
  padding: 4px;
  z-index: 3;
`;
const PostFormButtonMobile = styled.button`
  display: none;
  @media ${(props) => props.theme.mobile} {
    display: inherit;
    border-radius: 20px;
    color: #1882ff;
    border: 1px solid cornflowerblue;
    background-color: white;
    cursor: pointer;
    width: 92px;
    height: 28px;
  }
`;
const MessageWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
const MessageImgWrap = styled.div`
  display: flex;
  margin: 0 8px 0 0;
`;
const MessageImg = styled.img`
  cursor: pointer;
`;
const CheckedCount = styled.div`
  background-color: red;
  color: white;
  font-size: 8px;
  border-radius: 50%;
  width: 12px;
  height: 12px;
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;
