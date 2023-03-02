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
            <LandingTitleItem>
              <div>제주의 멋진 사진이 있는</div> &nbsp;
              <BoldFont>픽스팟에서 </BoldFont>&nbsp;
            </LandingTitleItem>
            <LandingTitleItem>
              <BoldFont>인생샷 명소</BoldFont>
              <div>를 찾아보세요!</div>
            </LandingTitleItem>
          </LandingTitle>
        </LogoTitleWrap>
        <TouchImage src="/landing/touch.png" />
        <CloudTop src="/landing/cloud_1.svg" />
        <CloudBottom src="/landing/cloud_2.svg" />
        <LandTop>
          <ImageTop
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
          />
        </LandTop>
        <LandBottom>
          <ImageBottom
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
          제주도 전체 사진 둘러보기 {'>'}
        </SkipButton>
      </LandContainer>
    </LandingWrap>
  );
}

export default Landing;

const LandingWrap = styled.div`
  background-color: #ececec;
  height: 100vh;
  @media ${(props) => props.theme.mobile} {
    background-color: #f7f7f7;
  }
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
  @media ${(props) => props.theme.mobile} {
    width: 400px;
    height: 700px;
  }
`;
const LogoTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${(props) => props.theme.mobile} {
  }
`;
const LogoImg = styled.img`
  width: 190px;
  height: 52px;
  @media ${(props) => props.theme.mobile} {
    margin-top: 40%;
    width: 132px;
    height: 36px;
  }
`;
const LandingTitle = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  font-size: 20px;
  @media ${(props) => props.theme.mobile} {
    margin-top: 30px;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
  }
`;
const TouchImage = styled.img`
  display: none;
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inherit;
    width: 47px;
    height: 82px;
  }
`;
const LandingTitleItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
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
  @media ${(props) => props.theme.mobile} {
    top: 38%;
    left: 65%;
    transform: translate(-50%, -50%);
    width: 110px;
    height: 50px;
  }
`;
const CloudBottom = styled.img`
  width: 214px;
  height: 100px;
  position: absolute;
  top: 75%;
  left: -5%;
  transform: translate(-50%, -50%);
  @media ${(props) => props.theme.mobile} {
    top: 76%;
    left: 33%;
    width: 82px;
    height: 48px;
  }
`;
const LandTop = styled.div`
  position: absolute;
  top: 39.5%;
  left: 50.5%;
  transform: translate(-50%, -50%);
  @media ${(props) => props.theme.mobile} {
    width: 337px;
    height: 345px;
    top: 71.5%;
  }
  :hover {
    cursor: pointer;
  }
`;
const ImageTop = styled.img`
  width: 692.61px;
  height: 208.82px;
  @media ${(props) => props.theme.mobile} {
    width: 337px;
    height: 102px;
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
  @media ${(props) => props.theme.mobile} {
    top: 65%;
  }
`;
const ImageBottom = styled.img`
  width: 708.27px;
  height: 229.41px;
  @media ${(props) => props.theme.mobile} {
    width: 345px;
    height: 112px;
  }
`;
const SkipButton = styled.div`
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  color: #1882ff;
  font-size: 14px;
  text-align: center;
  border-bottom: 1px solid #1882ff;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    font-size: 12px;
    top: 85%;
    width: 140px;
  }
`;
