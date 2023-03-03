import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { updatePassword, updateProfile } from 'firebase/auth';
import { customConfirm } from '@/utils/alerts';
import { useForm } from 'react-hook-form';
import { authService, storageService } from '@/firebase';
import { uploadString, getDownloadURL, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { updateUser } from '@/api';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { editProfileModalAtom } from '@/atom';

const imgFile = '/profileicon.svg';

interface SaveForm {
  nickname: string;
  newPassword: string;
  confirm: string;
}

function ModalProfile() {
  const [editProfileModal, setEditProfileModal] =
    useRecoilState(editProfileModalAtom);
  const [saveInformation, setSaveInformation] = useState<boolean>(false);
  const [nicknameToggle, setNicknameToggle] = useState(false);
  const [nicknameEdit, setNicknameEdit] = useState<string>(
    authService?.currentUser?.displayName as string
  );
  const [googleUser, setGoolgleUser] = useState(true);
  const [pwToggle, setPwToggle] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const profileimg = authService?.currentUser?.photoURL ?? imgFile;
  const [imgEdit, setImgEdit] = useState<string>(profileimg);

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
      displayName: nicknameEdit,
      photoURL: '',
    });

    setImgEdit(imgFile as string);
  };

  // 구글 로그인 유저라면 비밀번호 토글 숨기기
  useEffect(() => {
    const googleIdUser = localStorage.getItem('googleUser');
    if (googleIdUser) {
      setGoolgleUser(false);
    } else {
      setGoolgleUser(true);
    }
  }, []);

  // 프로필 사진 변경 후 변경 사항 유지하기
  const saveImgFile = () => {
    if (imgRef.current?.files) {
      const file = imgRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const resultImg = reader.result;
        localStorage.setItem('imgURL', resultImg as string);
        setImgEdit(resultImg as string);
      };
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SaveForm>({
    mode: 'onSubmit',
  });

  //* useMutation 사용해서 user 데이터 수정하기
  let editUser: any = {
    uid: authService.currentUser?.uid,
    userName: '',
    userImg: '',
  };
  const { mutate: onUpdateUser } = useMutation(updateUser);

  // 전체 프로필 수정을 완료하기
  const onSubmit = async (data: SaveForm) => {
    if (data.newPassword !== data.confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    const imgRef = ref(
      storageService,
      `${authService.currentUser?.uid}${uuidv4()}`
    );
    const imgDataUrl = localStorage.getItem('imgURL');
    let downloadUrl;
    if (imgDataUrl) {
      const response = await uploadString(imgRef, imgDataUrl, 'data_url');
      downloadUrl = await getDownloadURL(response.ref);
    }
    editUser = {
      ...editUser,
      userName: data.nickname,
      userImg: downloadUrl,
    };
    onUpdateUser(editUser, {
      onSuccess: () => {
        console.log('유저수정 요청 성공');
      },
      onError: () => {
        console.log('유저수정 요청 실패');
      },
    });

    // 사진만, 닉네임만, 비밀번호만 단독으로 고치는 것, 다 같이 고치는 것
    if (nicknameToggle && !pwToggle) {
      await updateProfile(authService?.currentUser!, {
        displayName: data.nickname,
        photoURL: downloadUrl ?? '',
      })
        .then((res) => {
          customConfirm('프로필 수정 완료하였습니다!');
          setEditProfileModal(!editProfileModal);
        })

        .catch((error) => {
          console.log(error);
        });
    } else if (!nicknameToggle && pwToggle) {
      await updateProfile(authService?.currentUser!, {
        photoURL: downloadUrl ?? '',
      }).catch((error) => {
        console.log(error);
      });
      await updatePassword(authService?.currentUser!, data.newPassword).then(
        (res) => {
          customConfirm('프로필 수정 완료하였습니다!');
          setEditProfileModal(!editProfileModal);
        }
      );
    } else if (nicknameToggle && pwToggle) {
      await updateProfile(authService?.currentUser!, {
        displayName: data.nickname,
        photoURL: downloadUrl ?? '',
      }).catch((error) => {
        console.log(error);
      });
      await updatePassword(authService?.currentUser!, data.newPassword)
        .then((res) => {
          setEditProfileModal(!editProfileModal);
          customConfirm('프로필 수정 완료하였습니다!');
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (!nicknameToggle && !pwToggle) {
      await updateProfile(authService?.currentUser!, {
        photoURL: downloadUrl ?? '',
      })
        .then((res) => {
          customConfirm('프로필 수정 완료하였습니다!');
          setEditProfileModal(!editProfileModal);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <ModalStyled
      // 배경화면 누르면 취소
      onClick={() => {
        setEditProfileModal(!editProfileModal);
      }}
    >
      <div className="modalBody" onClick={(e) => e.stopPropagation()}>
        {/* 좌측 상단 취소 버튼 */}
        <Heder
          onClick={() => {
            setEditProfileModal(!editProfileModal);
          }}
        >
          {' '}
          〈 취소{' '}
        </Heder>
        <ProfileContainerForm onSubmit={handleSubmit(onSubmit)}>
          <ProfileTextDiv>
            <b>회원정보 변경</b>
          </ProfileTextDiv>
          {/* 사진 변경 또는 삭제 */}
          <div>
            <ProfilePhotoDeleteBtn>
              <CancleImg src="/cancle-button.png" onClick={deleteImgFile} />
              <ProfilePhotoLabel htmlFor="changePhoto">
                <ProfilePhoto img={imgEdit}>
                  <ProfilePhotoHover img={imgEdit}>
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
            </ProfilePhotoDeleteBtn>
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
            {/* 닉네임 변경 */}
            <NicknameToggleContainer
              onClick={() => {
                setNicknameToggle((e) => !e);
              }}
            >
              <NicknameToggleText>
                닉네임 변경하기
                {nicknameToggle ? (
                  <CloseNicknameToggleImg src="/under-arrow.png" />
                ) : (
                  <OpenNicknameToggleImg src="/right-arrow.png" />
                )}
              </NicknameToggleText>
            </NicknameToggleContainer>
            {nicknameToggle && (
              <EditInputBox>
                <EditInput
                  {...register('nickname', {
                    required: '닉네임을 입력해주세요',
                    minLength: {
                      value: 2,
                      message: '2글자 이상의 닉네임으로 정해주세요',
                    },
                  })}
                  defaultValue={authService.currentUser?.displayName!}
                  placeholder="닉네임을 입력해 주세요"
                />
                <EditclearBtn
                  onClick={() => {
                    setValue('nickname', '');
                  }}
                ></EditclearBtn>
              </EditInputBox>
            )}
            <ProfileWarn>{errors?.nickname?.message}</ProfileWarn>

            {/* 비밀번호 변경 */}
            {/* 구글 유저 숨기기 */}
            <div>
              {googleUser ? (
                <PwToggleContainer
                  onClick={() => {
                    setPwToggle((e) => !e);
                  }}
                >
                  <PwToggleText>
                    비밀번호 변경하기
                    {pwToggle ? (
                      <ClosePwToggleImg src="/under-arrow.png" />
                    ) : (
                      <OpenPwToggleImg src="/right-arrow.png" />
                    )}
                  </PwToggleText>
                </PwToggleContainer>
              ) : (
                ''
              )}
            </div>

            {pwToggle && (
              <EditInputBox>
                <EditInput
                  {...register('newPassword', {
                    required: '비밀번호를 입력해주세요.',
                    minLength: {
                      value: 7,
                      message:
                        '*7~20자리 숫자 내 영문 숫자 특수문자 혼합 비밀번호를 입력해주세요',
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,20}$/,
                      message:
                        '*7~20자리 숫자 내 영문 숫자 특수문자 혼합 비밀번호를 입력해주세요',
                    },
                  })}
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                />
                <EditclearBtn
                  onClick={() => {
                    setValue('newPassword', '');
                  }}
                ></EditclearBtn>
              </EditInputBox>
            )}
            <ProfileWarn>{errors?.newPassword?.message}</ProfileWarn>
            {/* 비밀번호 확인 */}
            {pwToggle && (
              <EditInputBox>
                <EditInput
                  {...register('confirm', {
                    required: '비밀번호를 입력해주세요.',
                    minLength: {
                      value: 7,
                      message: '입력하신 비밀번호와 일치하지 않아요',
                    },
                  })}
                  type="password"
                  placeholder="비밀번호를 다시한번 입력해 주세요"
                />
                <EditclearBtn
                  onClick={() => {
                    setValue('confirm', '');
                  }}
                ></EditclearBtn>
              </EditInputBox>
            )}
            <ProfileWarn>{errors?.confirm?.message}</ProfileWarn>
          </EditProfileContainer>
          <SaveEditBtnContainer>
            <SaveEditBtn type="submit" disabled={saveInformation}>
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
  width: 100vw;
  height: 100vh;
  background-color: gray;
  display: flex;
  z-index: 1000000;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .modalBody {
    position: relative;
    color: black;
    width: 70%;
    max-width: 524px;
    height: 695px;
    max-height: 695px;
    padding: 30px 30px 30px 30px;
    z-index: 13;
    text-align: left;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    overflow-y: auto;
  }
`;
const Heder = styled.header`
  cursor: pointer;
  color: #1882ff;
  font-size: 14px;
`;
const ProfileContainerForm = styled.form`
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ProfileTextDiv = styled.div`
  margin-top: 61px;
  margin-bottom: 16px;
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 138.5%;
  text-align: center;
  color: #212121;
`;
const ProfilePhotoDeleteBtn = styled.div`
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  width: 120px;
  height: 120px;
`;
const CancleImg = styled.img`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 999999;
`;
const ProfilePhotoLabel = styled.label`
  cursor: pointer;
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
`;
const ProfilePhotoInput = styled.input``;
const NicknameToggleContainer = styled.div`
  background-color: transparent;
  margin-top: 36px;
  width: 394px;
  height: 48px;
  z-index: 2;
  display: 'flex';
  padding: '10px';
  box-sizing: 'border-box';
  cursor: pointer;
`;
const NicknameToggleText = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-size: 16px;
  font-weight: 700;
  font-weight: bold;
  line-height: 24px;
  letter-spacing: -0.025em;
  color: #212121;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const OpenNicknameToggleImg = styled.img`
  width: 12.03px;
  height: 22px;
  padding-right: 10px;
  background: transparent;
`;
const CloseNicknameToggleImg = styled.img`
  width: 22px;
  height: 12px;
  padding-right: 10px;
  background: transparent;
`;
const EditInputBox = styled.div`
  width: 100%;
  height: 48px;
  position: relative;
`;
const EditclearBtn = styled.div`
  position: absolute;
  top: 25%;
  right: -20px;
  width: 24px;
  height: 24px;
  background-image: url(/cancle-button.png);
  background-repeat: no-repeat;

  cursor: pointer;
`;
const EditInput = styled.input`
  height: 48px;
  width: 394px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #1882ff;
  margin-top: 8px;
`;

const PwToggleContainer = styled.div`
  background-color: transparent;
  width: 470px;
  height: 24px;
  z-index: 2;
  display: 'flex';
  padding: '10px';
  box-sizing: 'border-box';
  cursor: pointer;
`;
const PwToggleText = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-size: 16px;
  font-weight: 700;
  font-weight: bold;
  line-height: 24px;
  letter-spacing: -0.025em;
  color: #212121;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const OpenPwToggleImg = styled.img`
  width: 12.03px;
  height: 22px;
  padding-right: 10px;
  background: transparent;
`;
const ClosePwToggleImg = styled.img`
  width: 22px;
  height: 12px;
  padding-right: 10px;
  background: transparent;
`;
const ProfileWarn = styled.p`
  color: red;
  height: 12px;
  font-size: 12px;
  font-weight: 700px;
`;
const SaveEditBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 470px;
  bottom: 120px;
  position: absolute;
  bottom: 0;
  left: 0;
  margin-left: 64px;
  margin-bottom: 64px;
`;
const SaveEditBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: transparent;
  margin-top: 20px;
  transition: 0.1s;
  background-color: #1882ff;
  color: white;
  width: 394px;
  height: 48px;
  &:hover {
    cursor: pointer;
  }
`;
