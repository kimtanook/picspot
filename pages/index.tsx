import Image from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

function Landing() {
  const [imageTopHover, setImageTopHover] = useState(false);
  const [imageBottomHover, setImageBottomHover] = useState(false);
  const router = useRouter();

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
        <Link href={'/mypage'} hidden={!currentUser}>
          {authService.currentUser?.displayName
            ? `${authService.currentUser?.displayName}님의 프로필`
            : '프로필'}
        </Link>
      </div>
      {isOpenModal && (
        <Modal onClickToggleModal={onClickToggleModal}>
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
          <option value="">지역전체</option>
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
    <LandingWrap>
      <LandContainer>
        <LandingTitle>
          제주의 멋진 사진이 있는 스팟을 찾아 픽해보세요!
        </LandingTitle>
        <LandTop>
          <Image
            src={imageTopHover ? '/land-top-hover.png' : '/land-top.png'}
            onMouseOver={() => setImageTopHover(true)}
            onMouseOut={() => setImageTopHover(false)}
            onClick={() =>
              router.push({
                pathname: '/main',
                query: { city: '제주시' },
              })
            }
            alt="land-top"
            height={168}
            width={694}
          />
        </LandTop>
        <LandBottom>
          <Image
            src={
              imageBottomHover ? '/land-bottom-hover.png' : '/land-bottom.png'
            }
            onMouseOver={() => setImageBottomHover(true)}
            onMouseOut={() => setImageBottomHover(false)}
            onClick={() =>
              router.push({
                pathname: '/main',
                query: { city: '서귀포시' },
              })
            }
            alt="land-bottom"
            height={168}
            width={694}
          />
        </LandBottom>
        <SkipButton
          onClick={() =>
            router.push({
              pathname: '/main',
              query: { city: '' },
            })
          }
        >
          제주전체
        </SkipButton>
      </LandContainer>
    </LandingWrap>
  );
}
const LoginButton = styled.button``;

export default Landing;

const LandingWrap = styled.div`
  margin: auto;
  /* background-color: aqua; */
  width: 1440px;
  height: 810px;
`;
const LandContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* background-color: aqua; */
  width: 700px;
  height: 700px;
`;
const LandingTitle = styled.div`
  margin-top: 50px;
`;
const LandTop = styled.div`
  position: absolute;
  top: 20%;
  left: 49%;
  transform: translate(-50%, -50%);
  /* background-color: red; */
  rotate: -20deg;
  :hover {
    cursor: pointer;
  }
`;
const LandBottom = styled.div`
  position: absolute;
  top: 39%;
  left: 55%;
  transform: translate(-50%, -50%);
  /* background-color: blue; */
  rotate: -20deg;
  :hover {
    cursor: pointer;
  }
`;
const SkipButton = styled.div`
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  border-radius: 15px;
  width: 72px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  transition: 0.3s;
  :hover {
    cursor: pointer;
    background-color: #007924;
    border: 1px solid white;
    color: white;
    transition: 0.3s;
  }
`;
