import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { dbService } from './firebase';

//* 스토어에서 데이터 불러오기
export const getDatas = async () => {
  const response: any = [];

  const querySnapshot = await getDocs(collection(dbService, 'postTest'));
  querySnapshot.forEach((doc) => {
    response.push({ id: doc.id, ...doc.data() });
  });
  console.log('데이터를 불러왔습니다.');

  return response;
};

//* 스토어에 데이터 추가하기
export const addData: any = (data: any) => {
  console.log('data: ', data);
  addDoc(collection(dbService, 'postTest'), data);
  console.log('데이터가 추가되었습니다.');
};

//* 스토어에 데이터 삭제하기
export const deleteData: any = (docId: any) => {
  console.log('docId: ', docId);
  deleteDoc(doc(dbService, 'postTest', docId));
  console.log('데이터가 삭제되었습니다.');
};

//* 스토어에 데이터 수정하기
export const updataData: any = (data: any) => {
  console.log('data: ', data);
  updateDoc(doc(dbService, 'postTest', data.id), data);
  console.log('데이터가 수정되었습니다.');
};
