import styled from 'styled-components';
import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { authService, storageService } from '@/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { uploadString, getDownloadURL, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { customAlert } from '@/utils/alerts';
import { useMutation } from 'react-query';
import { updateUser } from '@/api';
import Link from 'next/link';

const imgFile = '/profileicon.svg';

const Profile = () => {
  // console.log(authService.currentUser?.uid);

  //* useMutation 사용해서 user 데이터 수정하기
  const { mutate: onUpdateUser } = useMutation(updateUser);

  let editUser: any = {
    uid: authService.currentUser?.uid,
    userName: '',
    userImg: '',
  };

  const profileimg = authService?.currentUser?.photoURL ?? imgFile;
  const [imgEdit, setImgEdit] = useState<string>(profileimg);
  const [nicknameEdit, setNicknameEdit] = useState<string>(
    authService?.currentUser?.displayName as string
  );
  const [currentUser, setCurrentUser] = useState(false);
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

    //* 프로필 변경 시 user 수정하기
    editUser = {
      ...editUser,
      userName: nicknameEdit,
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
  // 로그아웃
  const logOut = () => {
    signOut(authService).then(() => {
      // Sign-out successful.
      localStorage.clear();
      setCurrentUser(false);
      customAlert('로그아웃에 성공하였습니다!');
    });
  };
  return (
    <ProfileContainer>
      {/* 사진 */}
      <ProfileEdit>
      <div>
        <ProfileImage img={imgEdit}></ProfileImage>
          {editmode ? (
            <>
              <ProfilePhotoBtn>
                <ProfilePhotoLabel htmlFor="changePhoto">
                  파일선택
                </ProfilePhotoLabel>
              </ProfilePhotoBtn>
              <ProfilePhotoDeleteBtn onClick={deleteImgFile}>삭제</ProfilePhotoDeleteBtn>
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
      {/* 프로필 수정 */}
        <div hidden={!editmode} >
          <ProfileEditCancle onClick={profileEditCancle}>
            취소
          </ProfileEditCancle>
        </div>
        {editmode ? (
          <ProfileCompleteBtn onClick={profileEditComplete}>적용</ProfileCompleteBtn>
        ) : (
          <ProfileEditBtn onClick={profileEdit}>내 정보 변경  > </ProfileEditBtn>
        )}
        </div>
      </ProfileEdit>
      <ProfileText>
        <ProfileTextdiv>
          {/* 닉네임 */}
          {editmode ? (<ProfileNicknameEdit onChange={handleNicknameChange} ref={nameRef} defaultValue={authService.currentUser?.displayName!}/>) : (
                    <>
                      {' '}
                      <ProfileNickname>{authService.currentUser?.displayName}님</ProfileNickname>
                    </>
                  )}
              <Link href={'/main?city=제주전체'}>{authService.currentUser ? (<LogoutButton onClick={logOut}>로그아웃</LogoutButton>) : null}</Link>
        </ProfileTextdiv>

            <Follow>
              <MyProfileFollowing>팔로잉</MyProfileFollowing>
              {/* <div>{followingCount}곳</div> */}
              <MyProfileFollower>팔로워</MyProfileFollower>
              {/* <div>{followerCount}+</div> */}
            </Follow>

      </ProfileText>
    </ProfileContainer>
  );
};
export default Profile;

const ProfileContainer = styled.div`
display: flex;
justify-content: center;
`;
const ProfileEdit = styled.div`
padding-right: 15px;`;
const ProfileImage = styled.div<{ img: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
  box-shadow: 2px 2px 1px black;
`;
const ProfilePhotoBtn = styled.button`
  cursor: pointer;`;
const ProfilePhotoDeleteBtn = styled.button`
  cursor: pointer;`;
const ProfilePhotoLabel = styled.label`
  cursor: pointer;
`;
const ProfilePhotoInput = styled.input``;
const ProfileEditCancle = styled.button`
  cursor: pointer;
`;
const ProfileCompleteBtn = styled.button`
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const ProfileEditBtn = styled.button`
  border: none;
  background-color: transparent;
  color: cornflowerblue;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
  padding-left: 15px;
  cursor: pointer;
`;


const ProfileText = styled.div`
  padding-left: 15px;
`;
const ProfileTextdiv = styled.div`
  display: flex;
  place-items: flex-end;
`;
const ProfileNicknameEdit = styled.input`
width:70px;
height:25px;
`;
const ProfileNickname = styled.div`
  padding-top: 20px;
`;
const LogoutButton = styled.button`
  color: gray;
  background-color:transparent;
  border: none;
  text-decoration-line: underline;
  font-size: 10pt;
  cursor: pointer;
`;
const Follow = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  margin-top: 10px;
`;
const MyProfileFollowing = styled.div`
border-radius: 20px;
background-color: #f8f8f8;
padding: 10%;
font-size: 10pt;
width: 50px;
height: 50px;
margin-right: 10px;
text-align: center;
`;
const MyProfileFollower = styled.div`
border-radius: 20px;
background-color: #f8f8f8;
padding: 10%;
font-size: 10pt;
width: 50px;
height: 50px;
margin-left: 10px;
text-align: center;
`;


