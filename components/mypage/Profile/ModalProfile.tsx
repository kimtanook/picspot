import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { updatePassword, updateProfile } from 'firebase/auth';
import { customAlert } from '@/utils/alerts';
import { useForm } from 'react-hook-form';
import { authService, storageService } from '@/firebase';
import Image from 'next/image';

const imgFile = '/profileicon.svg';

interface SaveForm {
  nickname: string;
  newPassword: string;
  confirm: string;
}
interface Props {
  profileEditCancle: () => void;
  profileEditComplete: () => void;
  editProfileModal: () => void;
  imgEdit: string;
  setImgEdit: Dispatch<SetStateAction<string>>;
  nicknameEdit: string;
}

function ModalProfile(props: Props) {
  function editProfileModal() {
    props.editProfileModal();
  }
  const [saveInformation, setSaveInformation] = useState<boolean>(false);
  const [nicknamePwToggle, setNicknamePwToggle] = useState(false);
  const [newNickname, setNewNickname] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [error, setError] = useState<string>('');

  const imgRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // 모달 창이 나왔을때 백그라운드 클릭이 안되게 하고 스크롤도 고정하는 방법
  useEffect(() => {
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY) * -1);
    };
  }, []);

  // 프로필 사진 삭제
  const deleteImgFile = async () => {
    await updateProfile(authService?.currentUser!, {
      displayName: props.nicknameEdit,
      photoURL: '',
    })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
    props.setImgEdit(imgFile as string);
  };
  const onClickToggleModal = () => {
    if (!authService.currentUser) {
      setNicknamePwToggle(!nicknamePwToggle);
      return;
    }
  };
  // 전체 프로필 수정을 완료하기
  //  const profileEditComplete = async () => {
  //   const imgRef = ref(
  //     storageService,
  //     `${authService.currentUser?.uid}${uuidv4()}`
  //   );

  // 프로필 사진 변경 후 변경 사항 유지하기
  const saveImgFile = () => {
    console.log('사진 클릭');
    console.log(imgRef.current);
    if (imgRef.current?.files) {
      console.log('이프문 통과');
      const file = imgRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const resultImg = reader.result;
        localStorage.setItem('imgURL', resultImg as string);
        props.setImgEdit(resultImg as string);
      };
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveForm>({ mode: 'onBlur' });

  const onSubmit = async (data: SaveForm) => {
    if (data.newPassword !== data.confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      setError('비밀번호가 일치하지 않습니다');
      return;
    }
    if (error !== '') setError('');

    setSaveInformation(true);
    await updatePassword(authService?.currentUser!, newPassword)
      .then((res) => {
        updateProfile(authService?.currentUser!, {
          displayName: newNickname,
        });
        customAlert('회원정보 변경에 성공하였습니다!');
        props.editProfileModal();
      })
      .catch((error) => {
        if (error.code.includes('auth/weak-password')) {
          setSaveInformation(false);
          alert('비밀번호는 6자 이상이어야 합니다.');
          return;
        }
        if (error.code.includes('auth/invalid-display-name-in-use')) {
          setSaveInformation(false);
          alert('이미 사용중인 닉네임이예요');
          return;
        }
        setSaveInformation(false);
        alert('등록할 수 없습니다. 다시 시도해주세요');
        setError('Failed Change Profile');
      });
  };

  return (
    <ModalStyled onClick={editProfileModal}>
      <div className="modalBody" onClick={(e) => e.stopPropagation()}>
        <StHeder onClick={props.profileEditCancle}> 〈 취소 </StHeder>
        <ProfileContainerForm onSubmit={handleSubmit(onSubmit)}>
          <ProfileTextDiv>
            <b>회원정보 변경</b>
          </ProfileTextDiv>
          <div>
            <ProfilePhotoDeleteBtn onClick={deleteImgFile}>
              <div>
                <CancleImg src="/cancle-button.png" />
              </div>
            </ProfilePhotoDeleteBtn>
            <ProfilePhotoLabel htmlFor="changePhoto">
              <ProfilePhoto img={props.imgEdit}>
                <ProfilePhotoHover img={props.imgEdit}>
                  <Image
                    src={'/gallery.png'}
                    alt="gallery"
                    width={19.5}
                    height={19.5}
                  />
                  <span>프로필 사진 변경</span>
                </ProfilePhotoHover>
              </ProfilePhoto>
            </ProfilePhotoLabel>
          </div>
          <EditProfileContainer>
            <ProfilePhotoInput
              hidden
              id="changePhoto"
              type="file"
              placeholder="파일선택"
              onChange={saveImgFile}
              ref={imgRef}
            />
            <NicknameToggleBtn onClick={onClickToggleModal}>
              닉네임 변경하기
            </NicknameToggleBtn>
            <EditNicknameInput
              minLength={2}
              name="username"
              type="username"
              id="username"
              value={newNickname}
              ref={nameRef}
              defaultValue={authService.currentUser?.displayName!}
              onChange={(event) => setNewNickname(event.target.value)}
              placeholder="닉네임을 입력해 주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
            />
            <ProfileWarn>{errors?.nickname?.message}</ProfileWarn>
            <PwToggleBtn onClick={onClickToggleModal}>
              <div>비밀번호 변경하기</div>
              <div></div>
            </PwToggleBtn>
            <EditPwInput
              {...register('newPassword', {
                required: '비밀번호를 입력해주세요.',
                minLength: {
                  value: 8,
                  message:
                    '*7~20자리 숫자 내 영문 숫자 혼합 비밀번호를 입력해주세요',
                },
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message:
                    '*7~20자리 숫자 내 영문 숫자 혼합 비밀번호를 입력해주세요',
                },
              })}
              name="password"
              type="password"
              id="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="비밀번호를 입력해주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
            />
            <ProfileWarn>{errors?.newPassword?.message}</ProfileWarn>
            <EditPwConfirmInput
              {...register('confirm', {
                required: '비밀번호를 입력해주세요.',
                minLength: {
                  value: 8,
                  message: '입력하신 비밀번호와 일치하지 않아요',
                },
              })}
              autoComplete="new-password"
              name="confirm"
              type="password"
              id="confirm"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="비밀번호를 다시한번 입력해 주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
            />
            <ProfileWarn>{errors?.confirm?.message}</ProfileWarn>
          </EditProfileContainer>
          <SaveEditBtnContainer>
            <SaveEditBtn
              type="submit"
              disabled={saveInformation}
              onClick={props.profileEditComplete}
            >
              <div>회원정보 저장</div>
            </SaveEditBtn>
          </SaveEditBtnContainer>
        </ProfileContainerForm>
      </div>
    </ModalStyled>
  );
}

export default ModalProfile;

const ModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: gray;
  display: flex;
  z-index: 1000000;
  justify-content: center;
  align-items: center;

  .modalBody {
    position: absolute;
    color: black;
    width: 70%;
    max-width: 524px;
    height: 70%;
    max-height: 695px;
    padding: 30px 30px 30px 30px;
    z-index: 13;
    text-align: left;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  }
`;
const ProfileContainerForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const StHeder = styled.header`
  cursor: pointer;
  color: #1882ff;
  font-size: 14px;
`;
const ProfileTextDiv = styled.div`
  margin-top: 1vh;
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 138.5%;
  text-align: center;
  color: #212121;
`;
const ProfilePhoto = styled.div<{ img: string }>`
  width: 120px;
  height: 120px;
  border-radius: 300px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
`;
const ProfilePhotoHover = styled.div<{ img: string }>`
  width: 120px;
  height: 120px;
  border-radius: 300px;
  display: flex;
  flex-direction: column;
  z-index: 2;
  justify-content: center;
  align-items: center;
  gap: 5px;
  opacity: 0;
  &:hover {
    opacity: 1;
    font-size: 12px;
    font-weight: bold;
    background: linear-gradient(
      0deg,
      rgba(33, 33, 33, 0.6),
      rgba(33, 33, 33, 0.6)
    );

    color: white;
  }
`;

const EditProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  margin-top: 30px;
`;
const NicknameToggleBtn = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  width: 130px;
  height: 24px;
  z-index: 2;
  font-size: 16px;
`;

const EditNicknameInput = styled.input`
  height: 48px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
`;
const PwToggleBtn = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  width: 130px;
  height: 24px;
  z-index: 2;
  font-size: 16px;
`;

const EditPwInput = styled.input`
  height: 48px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
  margin-top: 30px;
`;
const EditPwConfirmInput = styled.input`
  height: 48px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
`;
const ProfileWarn = styled.p`
  color: red;
  font-size: 12px;
  font-weight: 700px;
`;
const SaveEditBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 90%;
`;
const SaveEditBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  border: transparent;
  margin-top: 20px;
  transition: 0.1s;
  background-color: #1882ff;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;
const ProfilePhotoDeleteBtn = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
const CancleImg = styled.img`
  margin-left: 100px;
`;
const ProfilePhotoLabel = styled.label`
  cursor: pointer;
`;
const ProfilePhotoInput = styled.input``;
