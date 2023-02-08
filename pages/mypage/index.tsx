import Seo from '@/components/Seo';
import { dbService } from '@/firebase';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Mypage() {
  const [arr, setArr] = useState([]);

  const [editTitle, setEditTitle] = useState('');

  //* 스토어에서 텍스트 가져오기
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
      console.log('newArr: ', newArr);
    });
  };

  useEffect(() => {
    getTestData();
  }, []);

  //* 스토어 텍스트 수정하기
  const editData = (docId: any) => {
    console.log('수정버튼을 클릭했습니다.');
    updateDoc(doc(dbService, 'test', docId), {
      test: editTitle,
    });
  };

  //* 스토어 텍스트 삭제하기
  const deleteData = (docId: any) => {
    console.log('삭제버튼을 클릭했습니다.');
    deleteDoc(doc(dbService, 'test', docId));
  };

  return (
    <div>
      <Seo title="My" />
      <h1>마이페이지임</h1>
      {arr.map((item: any) => (
        <div key={item.test}>
          <h3>{item.test}</h3>
          {/* <Image src={item.test} alt="test" width={200} height={200} /> */}
          <input
            onChange={(e) => {
              setEditTitle(e.target.value);
            }}
          />
          <button onClick={() => editData(item.id)}>수정</button>
          <button onClick={() => deleteData(item.id)}>삭제</button>
        </div>
      ))}
    </div>
  );
}
