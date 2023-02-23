import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

function Landing() {
  const [imageTopHover, setImageTopHover] = useState(false);
  const [imageBottomHover, setImageBottomHover] = useState(false);
  const router = useRouter();

  return (
    <LandingWrap>
      <LandContainer>
        <LogoTitleWrap>
          <LogoImg src="logo.png" />
          <LandingTitle>
            <div>제주의 멋진 사진이 있는</div> &nbsp;
            <BoldFont>픽스팟에서 인생샷 명소</BoldFont>
            <div>를 찾아보세요!</div>
          </LandingTitle>
        </LogoTitleWrap>
        <CloudTop src="/landing/cloud_1.svg" />
        <CloudBottom src="/landing/cloud_2.svg" />
        <LandTop>
          <Image
            src={imageTopHover ? '/landing/top-hover.svg' : '/landing/top.svg'}
            onMouseOver={() => setImageTopHover(true)}
            onMouseOut={() => setImageTopHover(false)}
            onClick={() =>
              router.push({
                pathname: '/main',
                query: { city: '제주시' },
              })
            }
            alt="land-top"
            height={208.82}
            width={692.61}
          />
        </LandTop>
        <LandBottom>
          <Image
            src={
              imageBottomHover
                ? '/landing/bottom-hover.svg'
                : '/landing/bottom.svg'
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
            height={229.41}
            width={708.27}
          />
        </LandBottom>
        <SkipButton
          onClick={() =>
            router.push({
              pathname: '/main',
              query: { city: '제주전체' },
            })
          }
        >
          지역 상관없이 제주도 사진 탐색하기 {'>'}
        </SkipButton>
      </LandContainer>
    </LandingWrap>
  );
}

export default Landing;

const LandingWrap = styled.div`
  background-color: #ececec;
  display: inherit;
  height: 100vh;
  margin: -10px;
`;
const LandContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 700px;
`;
const LogoTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LogoImg = styled.img`
  width: 190px;
  height: 52px;
`;
const LandingTitle = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  font-size: 20px;
`;
const BoldFont = styled.div`
  font-weight: 700;
`;
const CloudTop = styled.img`
  width: 214px;
  height: 100px;
  position: absolute;
  top: 23%;
  left: 80%;
  transform: translate(50%, -50%);
`;
const CloudBottom = styled.img`
  width: 214px;
  height: 100px;
  position: absolute;
  top: 75%;
  left: -5%;
  transform: translate(-50%, -50%);
`;
const LandTop = styled.div`
  position: absolute;
  top: 39.5%;
  left: 50.5%;
  transform: translate(-50%, -50%);
  :hover {
    cursor: pointer;
  }
`;
const LandBottom = styled.div`
  position: absolute;
  top: 61%;
  left: 50%;
  transform: translate(-50%, -50%);
  :hover {
    cursor: pointer;
  }
`;
const SkipButton = styled.div`
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 36px;
  color: #1882ff;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
`;
