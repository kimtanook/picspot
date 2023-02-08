import { dbService, storageService } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';

const PostForm = () => {
  const [test, setTest] = useState('');
  const [imageUpload, setImageUpload]: any = useState(null);
  // const [imageList, setImageList] = useState([]);

  const storage = storageService;
  // const imageListRef = ref(storage, 'images/');

  //* 이미지 스토리지에 업로드하기
  //* 이미지 스토리지에서 다운로드해서 스냅샷하기
  const upload = () => {
    if (imageUpload === null) return;

    console.log('imageUpload: ', imageUpload);
    const imageRef = ref(storage, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
      });
    });
  };

  //* 텍스트 스토어에 저장하기
  const onClickTest = async () => {
    await addDoc(collection(dbService, 'test'), {
      test: test,
    });
    console.log('추가가 되었습니다.');
  };

  // useEffect(() => {
  //   listAll(imageListRef).then((response) => {
  //     response.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageList((prev) => [...prev, url]);
  //       });
  //     });
  //   });
  // }, []);

  return (
    <div>
      <div>
        <input
          onChange={(e) => {
            e.target.value;
            setTest(e.target.value);
          }}
        />
        <button onClick={onClickTest}>추가</button>
      </div>
      <div>
        <input
          type="file"
          onChange={(event: any) => {
            setImageUpload(event.target.files[0]);
          }}
        />
        <button onClick={upload}>업로드</button>
      </div>
    </div>
  );
};

export default PostForm;
