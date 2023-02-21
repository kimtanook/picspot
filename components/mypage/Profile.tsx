import styled from 'styled-components';
import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { authService, storageService } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { uploadString, getDownloadURL, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { customAlert } from '@/utils/alerts';

const imgFile = '/profileicon.svg';

const Profile = () => {
  const profileimg = authService?.currentUser?.photoURL ?? imgFile;
  const [imgEdit, setImgEdit] = useState<string>(profileimg);
  const [nicknameEdit, setNicknameEdit] = useState<string>(
    authService?.currentUser?.displayName as string
  );
  const imgRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // 프로필 수정하기
  const [editmode, setEdit] = useState(false);
  const profileEdit = () => {
    localStorage.removeItem('imgURL');
    setEdit(!editmode);
  };

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
  // 프로필 사진 삭제
  const deleteImgFile = async () => {
    await updateProfile(authService?.currentUser!, {
      displayName: nicknameEdit,
      photoURL: '',
    })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
    setImgEdit(imgFile as string);
  };

  // 전체 프로필 수정을 완료하기
  const profileEditComplete = async () => {
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
    await updateProfile(authService?.currentUser!, {
      displayName: nicknameEdit,
      photoURL: downloadUrl ?? null,
    })
      .then((res) => {
        customAlert('프로필 수정 완료하였습니다!');
      })
      .then(() => {
        setEdit(!editmode);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // 전체 프로필 수정을 취소하기
  const profileEditCancle = () => {
    setImgEdit(authService?.currentUser?.photoURL as string);
    setNicknameEdit(authService?.currentUser?.displayName as string);
    setEdit(!editmode);
  };

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNicknameEdit(e.target.value);
  };

  return (
    <ProfileContainer>
      {/* 사진 */}
      <ProfilePhotoContainer>
        <ProfileImage img={imgEdit}></ProfileImage>
        {editmode ? (
          <>
            <ProfilePhotoBtn>
              <ProfilePhotoLabel htmlFor="changePhoto">
                파일선택
              </ProfilePhotoLabel>
            </ProfilePhotoBtn>
            <button onClick={deleteImgFile}>삭제</button>
            <ProfilePhotoInput
              hidden
              id="changePhoto"
              type="file"
              placeholder="파일선택"
              onChange={saveImgFile}
              ref={imgRef}
            />
          </>
        ) : (
          ''
        )}
      </ProfilePhotoContainer>
      {/* 닉네임 */}
      <ProfileNicknameContainer>
        {editmode ? (
          <ProfileNicknameEdit
            onChange={handleNicknameChange}
            ref={nameRef}
            defaultValue={authService.currentUser?.displayName!}
          />
        ) : (
          <>
            {' '}
            <ProfileNickname>
              {authService.currentUser?.displayName}
            </ProfileNickname>
          </>
        )}
      </ProfileNicknameContainer>
      {/* 프로필 수정 */}
      <ProfileEditContainer>
        <div hidden={!editmode}>
          <ProfileEditCancle onClick={profileEditCancle}>
            취소
          </ProfileEditCancle>
        </div>
        {editmode ? (
          <ProfileEditBtn onClick={profileEditComplete}>적용</ProfileEditBtn>
        ) : (
          <ProfileEditBtn onClick={profileEdit}>수정</ProfileEditBtn>
        )}
      </ProfileEditContainer>
    </ProfileContainer>
  );
};
export default Profile;

const ProfileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const ProfileImage = styled.div<{ img: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
  box-shadow: 2px 2px 1px black;
`;
const ProfilePhotoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfilePhotoBtn = styled.button``;
const ProfilePhotoLabel = styled.label`
  cursor: pointer;
  padding: 20px;
`;
const ProfilePhotoInput = styled.input``;
const ProfileNicknameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileNicknameEdit = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileNickname = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileEditContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileEditCancle = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileEditBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;
