import Seo from '@/components/Seo';
import { dbService } from '@/firebase';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function Mypage() {
  const [arr, setArr] = useState([]);

  //* 텍스트 스토어에서 가져오기
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

  return (
    <div>
      <Seo title="My" />
      <h1>마이페이지임</h1>
      {arr.map((item: any) => (
        <h3 key={item.test}>{item.test}</h3>
      ))}
    </div>
  );
}
