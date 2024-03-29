//@ts-ignore
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import { getSpecificUser, updateUser } from '@/api';
import { CustomBackgroundModal } from '@/atom';
import { authService } from '@/firebase';
import { uuidv4 } from '@firebase/util';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

function BackgroundModal() {
  const queryClient = useQueryClient();
  const [toggle, setToggle] = useRecoilState(CustomBackgroundModal);
  const [selectBackground, setSelectBackground] = useState('');
  const { mutate: updateBackground } = useMutation(updateUser);
  const isPc = useMediaQuery({ minWidth: 824 });

  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({ maxWidth: 424 });

  // 반응형 모바일 작업 시, 모달 지도 사이즈 줄이기
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);
  const onChangeBackground = (event: any) => {
    setSelectBackground(event.target.value);
    if (event.target.value) {
      const editBackground: any = {
        uid: authService.currentUser?.uid,
        background: event.target.value,
      };
      updateBackground(editBackground, {
        onSuccess: () => {
          console.log('배경 변경 성공');
          setTimeout(
            () => queryClient.invalidateQueries('backgroundData'),
            200
          );
        },
      });
    }
  };

  const userUid = authService.currentUser?.uid;
  const { data: specificUserData } = useQuery(
    ['backgroundData', userUid],
    getSpecificUser
  );

  const backgroundUrl = specificUserData?.background;

  const backgroundTheme = [
    { name: '없음', url: '/background/back_0.png' },
    { name: '테마 1', url: '/background/back_1.png' },
    { name: '테마 2', url: '/background/back_2.png' },
    { name: '테마 3', url: '/background/back_3.png' },
    { name: '테마 4', url: '/background/back_4.png' },
  ];
  const backgroundThemeMobile = [
    { name: '없음', url: '/background/back_0.png' },
    { name: '테마 1', url: '/background/back_1_m.png' },
    { name: '테마 2', url: '/background/back_2_m.png' },
    { name: '테마 3', url: '/background/back_3_m.png' },
    { name: '테마 4', url: '/background/back_4_m.png' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };

  return (
    <Wrap>
      <BackgroundWrap>
        <CancelButtonBox>
          {isMobile ? (
            <BackButton onClick={() => setToggle(false)}>〈</BackButton>
          ) : (
            <CloseButtonImg
              onClick={() => setToggle(false)}
              src="/background/close-line.png"
              alt="close-line"
            />
          )}
        </CancelButtonBox>
        {isMobile ? (
          <BackgroundBoxMobile onChange={onChangeBackground}>
            <MobileTitle>테마 변경</MobileTitle>
            <StyledSlider {...settings}>
              {backgroundThemeMobile.map((item: any) => (
                <label key={uuidv4()}>
                  <ThemeBox>
                    <ThemeName>{item.name}</ThemeName>
                    <CurrentTheme backgroundUrl={backgroundUrl} url={item.url}>
                      사용중인 테마
                    </CurrentTheme>
                  </ThemeBox>
                  <ImageBox>
                    <Image
                      src={item.url}
                      backgroundUrl={backgroundUrl}
                      url={item.url}
                      alt="background-image"
                    />
                    <Input type="radio" name="background" value={item.url} />
                  </ImageBox>
                </label>
              ))}
            </StyledSlider>
            <CompleteCustom onClick={() => setToggle(false)}>
              테마 변경하기
            </CompleteCustom>
          </BackgroundBoxMobile>
        ) : (
          <>
            <BackgroundBox onChange={onChangeBackground}>
              {backgroundTheme.map((item: any) => (
                <label key={uuidv4()}>
                  <ThemeBox>
                    <ThemeName>{item.name}</ThemeName>
                    <CurrentTheme backgroundUrl={backgroundUrl} url={item.url}>
                      사용중인 테마
                    </CurrentTheme>
                  </ThemeBox>
                  <ImageBox>
                    <Image
                      src={item.url}
                      backgroundUrl={backgroundUrl}
                      url={item.url}
                      alt="background-image"
                    />
                    <Input type="radio" name="background" value={item.url} />
                  </ImageBox>
                </label>
              ))}
            </BackgroundBox>
            <CompleteCustom onClick={() => setToggle(false)}>
              테마 변경하기
            </CompleteCustom>
          </>
        )}
      </BackgroundWrap>
    </Wrap>
  );
}

export default BackgroundModal;

const Wrap = styled.div`
  position: fixed;
  top: 50%;
  left: 100%;
  transform: translate(-50%, -50%);
  z-index: 1;
  @media ${(props) => props.theme.mobile} {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const BackgroundWrap = styled.div`
  background-color: white;
  width: 350px;
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translate(0, -50%);
  @media ${(props) => props.theme.mobile} {
    right: inherit;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
  }
`;

const CancelButtonBox = styled.div`
  position: absolute;
  right: 0px;
  padding: 4px;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    right: inherit;
    left: 12px;
    top: 28px;
  }
`;
const CloseButtonImg = styled.img``;
const BackButton = styled.div`
  font-size: 24px;
  width: 20px;
`;
const BackgroundBoxMobile = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
const MobileTitle = styled.div`
  text-align: center;
  margin-top: 10%;
  margin-bottom: 10%;
`;
const StyledSlider = styled(Slider)`
  .slick-prev,
  .slick-next {
    display: none !important;
  }
`;
const ThemeBox = styled.div`
  margin: auto;
  margin-top: 12px;
  width: 300px;
  height: 30px;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const CurrentTheme = styled.div<{ backgroundUrl: string; url: string }>`
  width: 85px;
  height: 26px;
  background-color: #1882ff;
  font-size: 12px;
  color: white;
  text-align: center;
  line-height: 26px;
  border-radius: 52px;
  margin-right: 112px;
  display: ${(props) => (props.backgroundUrl === props.url ? 'block' : 'none')};
`;
const CompleteCustom = styled.div`
  cursor: pointer;
  background-color: #1882ff;
  width: 326px;
  height: 48px;
  margin: 12px auto 12px auto;
  text-align: center;
  line-height: 48px;
  color: white;
`;
const BackgroundBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 92vh;
  overflow-y: scroll;
  box-shadow: -16px 0px 8px rgba(0, 0, 0, 0.1);
  padding-bottom: 24px;
`;

const ThemeName = styled.div`
  @media ${(props) => props.theme.mobile} {
    padding: inherit;
  }
`;
const Input = styled.input`
  display: none;
`;
const ImageBox = styled.div`
  padding: 0 16px 0 16px;
`;
const Image = styled.img<{ backgroundUrl: string; url: string }>`
  height: 200px;
  width: 300px;
  border-radius: 8px;
  border: ${(props) =>
    props.backgroundUrl === props.url
      ? '2px solid blue'
      : '1px solid rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    width: 300px;
    height: 400px;
    margin: 20px auto 20px auto;
  }
`;
