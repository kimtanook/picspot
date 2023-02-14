import { authService, storageService } from '@/firebase';
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMutation } from 'react-query';
import { addData } from '@/api';
import Dropdown from 'components/main/Dropdown';

//! postState 타입 해결
//! imageUpload 타입 해결
const PostForm = () => {
  const [title, setTitle] = useState('');
  const [imageUpload, setImageUpload]: any = useState(null);
  const [dropdownVisibility, setDropdownVisibility] = React.useState(false);
  const [city, setCity] = useState('');
  const [counter, setCounter] = useState(0);

  const creator = authService.currentUser?.uid;

  let postState: any = {
    title: title,
    imgUrl: '',
    createdAt: Date.now(),
    creator: creator,
    postId: crypto.randomUUID(),
    city: city,
    town: '',
    clickCounter: counter,
  };

  //* useMutation 사용해서 데이터 추가하기
  const { mutate: onAddData } = useMutation(addData);

  //* 추가버튼 눌렀을때 실행하는 함수
  const onClickAddData = async () => {
    if (imageUpload === null) {
      alert('이미지를 추가해주세요.');
      return;
    }
    const imageRef = ref(storageService, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        console.log('url: ', url);
        const response = url;
        postState = {
          ...postState,
          imgUrl: response,
        };
        onAddData(postState, {
          onSuccess: () => {
            console.log('추가 요청 성공');
          },
          onError: () => {
            console.log('추가 요청 실패');
          },
        });
      });
    });

    // console.log('test URL', imgUrl);
  };

  const clickTown = (e: any) => {
    setCity(e.target.innerText);
  };

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(event: any) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <input
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <button onClick={onClickAddData}>추가</button>
      <button onClick={() => setDropdownVisibility(!dropdownVisibility)}>
        {dropdownVisibility ? '닫기' : '열기'}
      </button>
      <div className="app">
        <Dropdown visibility={dropdownVisibility}>
          <ul>
            <button onClick={clickTown}>제주시</button>
            <button onClick={clickTown}>서귀포시</button>
          </ul>
        </Dropdown>
      </div>
    </>
  );
};

export default PostForm;
