import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { dbService } from './firebase';

//* 스토어에서 데이터 불러오기
export const getDatas = async () => {
  // const q = query(collection(dbService, 'post'), orderBy('createdAt', 'desc'));
  const response: any = [];

  const querySnapshot = await getDocs(collection(dbService, 'post'));
  querySnapshot.forEach((doc) => {
    response.push({ id: doc.id, ...doc.data() });
  });
  console.log('데이터를 불러왔습니다.');
  return response;
};

//* 스토어에 데이터 추가하기
export const addData: any = (data: any) => {
  console.log('data: ', data);
  addDoc(collection(dbService, 'post'), data);
  console.log('데이터가 추가되었습니다.');
};

//* 스토어에 데이터 삭제하기
export const deleteData: any = (docId: any) => {
  console.log('docId: ', docId);
  deleteDoc(doc(dbService, 'post', docId));
  console.log('데이터가 삭제되었습니다.');
};

//* 스토어에 데이터 수정하기
export const updataData: any = (data: any) => {
  console.log('data: ', data);
  updateDoc(doc(dbService, 'post', data.id), data);
  console.log('데이터가 수정되었습니다.');
};

export const postCounter: any = async () => {
  await updateDoc(doc(dbService, 'post', 'oEsL3tvLEvgjT6AF4i6g'), {
    clickCounter: increment(1),
  });
};

// export const postCounter: any = (data: any) => {
//   updateDoc(doc(dbService, 'post', data.id), {
//     clickCounter: increment(1),
//   });
// };
