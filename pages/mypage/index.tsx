import Seo from '@/components/Seo';
import { dbService, storageService } from '@/firebase';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Mypage() {
  const [arr, setArr] = useState([]);

  const [editTitle, setEditTitle] = useState('');
  const [editImageUpload, setEditImageUpload]: any = useState(null);
  const [editImageUrl, setEditImageUrl] = useState('');

  const editState = {
    test: editTitle,
    url: editImageUrl,
  };

  //* 스토어에서 데이터 가져오기
  const getTestData = () => {
    const q = query(collection(dbService, 'test'));

    onSnapshot(q, (snapshot) => {
      const newArr: any = [];
      snapshot.docs.map((doc) => {
        const newObj = {
          id: doc.id,
          ...doc.data(), // doc.data() : { text, createdAt, ...  }
        };
        newArr.push(newObj);
        setArr(newArr);
      });
      // console.log('newArr: ', newArr);
    });
  };

  //* 스토어 데이터 출력하기
  useEffect(() => {
    getTestData();
  }, []);

  //* 스토어에 데이터 수정하기
  const editData = (docId: any) => {
    console.log('수정버튼을 클릭했습니다.');
    updateDoc(doc(dbService, 'test', docId), editState);
  };

  //* 스토어에 데이터 삭제하기
  const deleteData = (docId: any) => {
    console.log('삭제버튼을 클릭했습니다.');
    deleteDoc(doc(dbService, 'test', docId));
  };

  //* 스토리지에 이미지 업로드하기
  //* 스토리지에 있는 이미지 스냅샷해서 URL 가져오기
  const editUpload = () => {
    if (editImageUpload === null) return;

    // console.log('editImageUpload: ', editImageUpload);
    const imageRef = ref(storageService, `images/${editImageUpload.name}`);
    uploadBytes(imageRef, editImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        console.log('url: ', url);
        setEditImageUrl(url);
      });
    });
  };

  return (
    <div>
      <Seo title="My" />
      <h1>마이페이지임</h1>
      {arr.map((item: any) => (
        <div key={item.id}>
          <h3>{item.test}</h3>
          <input
            onChange={(e) => {
              // console.log(e.target.value);
              setEditTitle(e.target.value);
            }}
          />
          <button onClick={() => editData(item.id)}>수정</button>
          <button onClick={() => deleteData(item.id)}>삭제</button>
          <input
            type="file"
            onChange={(event: any) => {
              setEditImageUpload(event.target.files[0]);
            }}
          />
          <button onClick={editUpload}>업로드</button>
          <Image src={item.url} alt="image" height={100} width={100} />
        </div>
      ))}
    </div>
  );
}
