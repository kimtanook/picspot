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
  font-size: 24px;
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
