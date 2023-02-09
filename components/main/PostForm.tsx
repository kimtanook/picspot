import { dbService, storageService } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PostForm = () => {
  const [test, setTest] = useState('');
  const [imageUpload, setImageUpload]: any = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const initsialState = {
    test: test,
    url: imageUrl,
  };

  //* 스토리지에 이미지 업로드하기
  //* 스토리지에 있는 이미지 스냅샷해서 URL 가져오기
  const upload = () => {
    if (imageUpload === null) return;

    // console.log('imageUpload: ', imageUpload);
    const imageRef = ref(storageService, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        console.log('url: ', url);
        setImageUrl(url);
      });
    });
  };

  //* 스토어에 데이터 저장하기
  const onClickTest = async () => {
    await addDoc(collection(dbService, 'test'), initsialState);
    console.log('데이터가 저장되었습니다.');
  };

  return (
    <div>
      <input
        type="file"
        onChange={(event: any) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={upload}>업로드</button>
      <input
        onChange={(e) => {
          e.target.value;
          setTest(e.target.value);
        }}
      />
      <button onClick={onClickTest}>추가</button>
    </div>
  );
};

export default PostForm;
