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
  limit,
  startAfter,
} from 'firebase/firestore';
import { dbService } from './firebase';

//* 무한스크롤 데이터 불러오기
// startAt() 또는 startAfter()메서드를 사용하여 쿼리의 시작점을 정의합니다. startAt()메서드는 시작점을 포함하고, startAfter() 메서드는 시작점을 제외합니다.
//예를 들어 쿼리에 startAt(A)을 사용하면 전체 알파벳이 반환됩니다. startAfter(A)를 대신 사용하면. B-Z가 반환됩니다.
let lastVisible: any = undefined;
export const getInfiniteData = async () => {
  const getData: any = [];
  let q;
  if (lastVisible === -1) {
    return;
  } else if (lastVisible) {
    q = query(
      collection(dbService, 'post'),
      orderBy('createdAt', 'desc'),
      limit(8),
      startAfter(lastVisible)
    );
  } else {
    q = query(
      collection(dbService, 'post'),
      orderBy('createdAt', 'desc'),
      limit(16)
    );
  }

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    getData.push({ id: doc.id, ...doc.data() });
    if (querySnapshot.docs.length === 0) {
      lastVisible = -1;
    } else {
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    }
  });

  console.log('데이터를 불러왔습니다.');
  return getData;
};

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
  // console.log('data: ', data);
  updateDoc(doc(dbService, 'post', data.id), data);
  console.log('데이터가 수정되었습니다.');
};

export const postCounter: any = async (item: any) => {
  // console.log('item', item);
  await updateDoc(doc(dbService, 'post', item), {
    clickCounter: increment(1),
  });
};

// export const postCounter: any = (data: any) => {
//   updateDoc(doc(dbService, 'post', data.id), {
//     clickCounter: increment(1),
//   });
// };
