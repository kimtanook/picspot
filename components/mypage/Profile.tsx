import styled from 'styled-components';
import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { authService, storageService } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { uploadString, getDownloadURL, ref } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

type ProfileItem = {
  image: string;
  nickname: string;
};

const imgProfile = 'https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927';

const Profile = () => {
  const initialState = {
    nickname: authService?.currentUser?.displayName as string,
    image: imgProfile,
  };

  const [profile, setProfile] = useState<ProfileItem>(initialState);
  const [imgFile, setImgFile] = useState<string>(
    authService?.currentUser?.photoURL as string
  );
  const [nicknameEdit, setNicknameEdit] = useState<string>(
    authService?.currentUser?.displayName as string
  );
  const imgRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const auth = getAuth();
  const user = auth.currentUser?.uid!;

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
        setImgFile(resultImg as string);
      };
    }
  };

  // 전체 프로필 수정을 완료하기
  // 전체 프로필 수정을 취소하기

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNicknameEdit(e.target.value);
  };
  return (
    <ProfileContainer>
      <ProfilePhotoContainer>
        <>
          <ProfilePhotoBtn>
            <ProfilePhotoLabel htmlFor="changePhoto">
              파일선택
            </ProfilePhotoLabel>
          </ProfilePhotoBtn>
          <ProfilePhotoInput
            id="changePhoto"
            type="file"
            placeholder="파일선택"
            onChange={saveImgFile}
          />
        </>
      </ProfilePhotoContainer>
      <ProfileNicknameContainer></ProfileNicknameContainer>
      <ProfileEditContainer>
        <ProfileEditBtn></ProfileEditBtn>
      </ProfileEditContainer>
    </ProfileContainer>
  );
};
export default Profile;

const ProfileContainer = styled.div`
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const ProfilePhotoContainer = styled.div`
  border: 1px solid pink;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfilePhotoBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfilePhotoLabel = styled.label`
  cursor: pointer;
  padding: 20px;
`;
const ProfilePhotoInput = styled.input`
  height: 30px;
  margin-top: 7px;
  padding-left: 5px;
  background-color: white;
  border: 2px solid white;
  border-radius: 5px;
`;
const ProfileNicknameContainer = styled.div`
  border: 1px solid orange;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileEditContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileEditBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;
