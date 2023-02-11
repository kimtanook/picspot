import { dbService, storageService } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMutation, useQueryClient } from 'react-query';
import { addData } from '@/api';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [imageUpload, setImageUpload]: any = useState(null);
  const [imgUrl, setImgUrl] = useState('');

  const postState: any = {
    title: title,
    url: imgUrl,
  };

  //* useMutation 사용해서 데이터 추가하기
  const { mutate: onAddData } = useMutation(addData);

  //* 추가버튼 눌렀을때 실행하는 함수
  const onClickAddData = async () => {
    onAddData(postState, {
      onSuccess: () => {
        console.log('추가 요청 성공');
      },
      onError: () => {
        console.log('추가 요청 실패');
      },
    });
  };

  //* 스토리지에 이미지 업로드하기
  //* 스토리지에 있는 이미지 URL 가져오기
  const onClickImgUpload = () => {
    if (imageUpload === null) {
      alert('이미지를 추가해주세요.');
      return;
    }

    const imageRef = ref(storageService, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        console.log('url: ', url);
        setImgUrl(url);
      });
    });
  };

  return (
    <>
      <input
        type="file"
        onChange={(event: any) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={onClickImgUpload}>업로드</button>
      <input
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <button onClick={onClickAddData}>추가</button>
    </>
  );
};

export default PostForm;
