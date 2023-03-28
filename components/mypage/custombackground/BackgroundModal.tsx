import { getSpecificUser, updateUser } from '@/api';
import { CustomBackgroundModal } from '@/atom';
import { authService } from '@/firebase';
import { uuidv4 } from '@firebase/util';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

function BackgroundModal() {
  const queryClient = useQueryClient();
  const [toggle, setToggle] = useRecoilState(CustomBackgroundModal);
  const [selectBackground, setSelectBackground] = useState('');
  const [addToggle, setAddToggle] = useState(false);
  const { mutate: updateBackground } = useMutation(updateUser);
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
    { name: '테마 1', url: '/background/back_1.jpg' },
    { name: '테마 2', url: '/background/back_2.jpeg' },
    { name: '테마 3', url: '/background/back_3.png' },
  ];

  return (
    <Wrap>
      <BackgroundWrap>
        <CancelButtonBox>
          <CloseButtonImg
            onClick={() => setToggle(false)}
            src="/background/close-line.png"
            alt="close-line"
          />
        </CancelButtonBox>
        <BackgroundBox onChange={onChangeBackground}>
          <div>
            <ThemeName>없음</ThemeName>
            <ImageBox>
              <Image
                src="/background/back_0.png"
                backgroundUrl={backgroundUrl}
                url="inherit"
                alt="background-image"
              />
              <Input type="radio" name="background" value="inherit" />
            </ImageBox>
          </div>
          {backgroundTheme.map((item: any) => (
            <label key={uuidv4()}>
              <ThemeName>{item.name}</ThemeName>
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
      </BackgroundWrap>
    </Wrap>
  );
}

export default BackgroundModal;

const Wrap = styled.div`
  position: absolute;
  top: 50%;
  left: 82%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const BackgroundWrap = styled.div`
  background-color: white;
  width: 350px;
  position: absolute;
  top: 50%;
  left: 0px;
  transform: translate(0, -50%);
`;

const CancelButtonBox = styled.div`
  position: absolute;
  right: 0px;
  padding: 4px;
  cursor: pointer;
`;
const CloseButtonImg = styled.img``;

const BackgroundBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow-y: scroll;
  box-shadow: -16px 0px 8px rgba(0, 0, 0, 0.1);
`;

const ThemeName = styled.div`
  padding: 28px 16px 8px 16px;
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
    props.backgroundUrl === props.url ? '2px solid blue' : null};
  cursor: pointer;
`;
