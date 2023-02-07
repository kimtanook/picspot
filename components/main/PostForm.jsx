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
} from 'firebase/storage';

const PostForm = () => {
  //test state
  const [test, setTest] = useState('');

  //image 관련
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);

  const storage = storageService;
  const imageListRef = ref(storage, 'images/');

  const upload = () => {
    if (imageUpload === null) return;

    const imageRef = ref(storage, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url]);
      });
    });

    console.log(imageUpload, imageList);
  };
  // 이미지를 불러올 때
  // useEffect(() => {
  //   listAll(imageListRef).then((response) => {
  //     response.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageList((prev) => [...prev, url]);
  //       });
  //     });
  //   });
  // }, []);

  const onClickTest = async () => {
    await addDoc(collection(dbService, 'post'), {
      test: test,
    });
    // console.log('dd');
  };

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
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
        />
        <button onClick={upload}>업로드</button>
        {imageList.map((el) => {
          return <img key={el} src={el} />;
        })}
      </div>
    </div>
  );
};
export default PostForm;
