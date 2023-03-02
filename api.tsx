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
  where,
  QueryDocumentSnapshot,
  DocumentData,
  endAt,
  startAt,
  setDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { dbService } from './firebase';

//* 무한스크롤 데이터 불러오기
// startAt() 또는 startAfter()메서드를 사용하여 쿼리의 시작점을 정의합니다. startAt()메서드는 시작점을 포함하고, startAfter() 메서드는 시작점을 제외합니다.
//예를 들어 쿼리에 startAt(A)을 사용하면 전체 알파벳이 반환됩니다. startAfter(A)를 대신 사용하면. B-Z가 반환됩니다.
let lastVisible: QueryDocumentSnapshot<DocumentData> | number | undefined =
  undefined;
export const visibleReset = () => {
  // 리셋을 해주지 않으면 새로고침 전까지 lastVisible이 querySnapshot.docs.length로 유지됨
  // 그로 인해, 페이지 이동 후 돌아오면 다음 페이지부터 보여주므로 기존 데이터 날아감.
  lastVisible = undefined;
};
export const getInfiniteData = async ({ queryKey }: any) => {
  const [_, option, value, town, city] = queryKey;
  const getData: { [key: string]: string }[] = [];
  let q;

  if (lastVisible === -1) {
    return;
  } else {
    if (value && lastVisible) {
      q = query(
        collection(dbService, 'post'),
        orderBy(option),
        startAt((option === 'address' ? '제주특별자치도 ' : '') + value),
        endAt(
          (option === 'address' ? '제주특별자치도 ' : '') + value + '\uf8ff'
        ),
        limit(8),
        startAfter(lastVisible)
      );
    } else if (value) {
      q = query(
        collection(dbService, 'post'),
        orderBy(option),
        startAt((option === 'address' ? '제주특별자치도 ' : '') + value),
        endAt(
          (option === 'address' ? '제주특별자치도 ' : '') + value + '\uf8ff'
        ),
        limit(20)
      );
    } else {
      if (town.length !== 0 && town[0] !== '' && lastVisible) {
        q = query(
          collection(dbService, 'post'),
          where('town', 'in', town),
          orderBy('createdAt', 'desc'),
          limit(8),
          startAfter(lastVisible)
        );
      } else if (town.length !== 0 && town[0] !== '') {
        q = query(
          collection(dbService, 'post'),
          where('town', 'in', town),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      } else {
        if (city !== '제주전체' && lastVisible) {
          q = query(
            collection(dbService, 'post'),
            where('city', '==', city),
            orderBy('createdAt', 'desc'),
            limit(8),
            startAfter(lastVisible)
          );
        } else if (city !== '제주전체') {
          q = query(
            collection(dbService, 'post'),
            where('city', '==', city),
            orderBy('createdAt', 'desc'),
            limit(20)
          );
        } else {
          if (lastVisible) {
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
              limit(20)
            );
          }
        }
      }
    }
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

  return getData;
};

//* 스토어에서 데이터 불러오기
export const getData = async () => {
  const response: any = [];

  const querySnapshot = await getDocs(collection(dbService, 'post'));
  querySnapshot.forEach((doc) => {
    response.push({ id: doc.id, ...doc.data() });
  });

  return response;
};

//* 스토어에 데이터 추가하기
export const addData: any = (data: any) => {
  addDoc(collection(dbService, 'post'), data);
};
//* 스토어에 데이터 삭제하기
export const deleteData: any = (docId: any) => {
  deleteDoc(doc(dbService, 'post', docId));
};

//* 스토어에 데이터 수정하기
export const updateData: any = (data: any) => {
  updateDoc(doc(dbService, 'post', data.id), data);
};

//* 댓글 가져오기
export const getComment = async ({ queryKey }: any) => {
  const [, postId] = queryKey;
  const response: any = [];
  const q = query(
    collection(dbService, `post/${postId}/comment`),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    response.push({ id: doc.id, ...doc.data() });
  });
  return response;
};

//* 댓글 추가
export const addComment = async (item: AddComment) => {
  console.log('item : ', item);
  await addDoc(
    collection(dbService, `post/${item.postId}/comment`),
    item.submitCommentData
  );
};

//* 댓글 삭제

export const deleteComment = async (item: DeleteComment) => {
  deleteDoc(doc(dbService, `post/${item.postId}/comment/${item.commentId}`));
};

//* 조회수 증가하기
export const postCounter = async (item: any) => {
  await updateDoc(doc(dbService, 'post', item), {
    clickCounter: increment(1),
  });
};

//* collection 데이터 불러오기
export const getCollection = async () => {
  const response: any = [];

  const querySnapshot = await getDocs(collection(dbService, 'collection'));
  querySnapshot.forEach((doc) => {
    response.push({ uid: doc.id, ...doc.data() });
  });

  return response;
};

//* collection  데이터 추가하기
export const addCollectionData: any = ({
  uid,
  collector,
  town,
  imgUrl,
}: any) => {
  setDoc(
    doc(dbService, 'collection', uid),
    {
      collector: arrayUnion(collector),
      uid: uid,
      town: town,
      imgUrl: imgUrl,
    },
    { merge: true }
  );
};

//* collection  데이터 삭제하기
export const deleteCollectionData: any = ({ uid, collector }: any) => {
  updateDoc(doc(dbService, 'collection', uid), {
    collector: arrayRemove(collector),
  });
};

//* 팔로잉 추가하기
export const addFollowing: any = (data: any) => {
  // console.log('data: ', data);
  setDoc(
    doc(dbService, 'following', data.uid),
    {
      following: arrayUnion(data.creator),
    },
    { merge: true }
  );
};

//* 팔로잉 삭제하기
export const deleteFollowing: any = (data: any) => {
  updateDoc(doc(dbService, 'following', data.uid), {
    following: arrayRemove(data.creator),
  });
};

//* 팔로잉 가져오기
export const getFollowing = async () => {
  const response: any = [];

  const querySnapshot = await getDocs(collection(dbService, 'following'));
  querySnapshot.forEach((doc) => {
    response.push({ uid: doc.id, ...doc.data() });
  });

  return response;
};

//* 팔로우 추가하기
export const addFollow: any = (data: any) => {
  setDoc(
    doc(dbService, 'follow', data.creator),
    {
      follow: arrayUnion(data.uid),
    },
    { merge: true }
  );
};

//* 팔로우 삭제하기
export const deleteFollow: any = (data: any) => {
  updateDoc(doc(dbService, 'follow', data.creator), {
    follow: arrayRemove(data.uid),
  });
};

//* 팔로우 가져오기
export const getFollow = async () => {
  const response: any = [];

  const querySnapshot = await getDocs(collection(dbService, 'follow'));
  querySnapshot.forEach((doc) => {
    response.push({ docId: doc.id, ...doc.data() });
  });

  return response;
};

//* 유저 추가하기
export const addUser: any = (data: any) => {
  setDoc(doc(dbService, 'user', data.uid), {
    uid: data.uid,
    userName: data.userName,
    userImg: data.userImg,
  });
};

//* 유저 가져오기
export const getUser = async () => {
  const response: any = [];

  const querySnapshot = await getDocs(collection(dbService, 'user'));
  querySnapshot.forEach((doc) => {
    response.push({ ...doc.data() });
  });

  return response;
};

//* 유저 수정하기
export const updateUser: any = (data: any) => {
  updateDoc(doc(dbService, 'user', data.uid), data);
};

// 상대방에게 메세지 보내기
export const addSendMessage = async (item: CreateMessage) => {
  await addDoc(collection(dbService, `message/take/${item.takeUser}`), item);
};

// 내가 보낸 메세지 저장
export const addSendedMessage = async (item: CreateMessage) => {
  await addDoc(collection(dbService, `message/send/${item.sendUser}`), item);
};

// 받은 메세지 가져오기
export const getTakeMessage = async ({ queryKey }: MessageQueryKey) => {
  const [_, id] = queryKey;
  const data: SendTakeMessage[] = [];
  const q = query(
    collection(dbService, `message/take/${id}`),
    orderBy('time', 'desc')
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};
// 보낸 메세지 가져오기
export const getSendMessage = async ({ queryKey }: MessageQueryKey) => {
  const [_, id] = queryKey;
  const data: SendTakeMessage[] = [];
  const q = query(
    collection(dbService, `message/send/${id}`),
    orderBy('time', 'desc')
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};
// 받은 메세지 삭제
export const deleteTakeMessage = async (item: DeleteMessage) => {
  deleteDoc(doc(dbService, `message/take/${item.uid}/${item.id}`));
};
// 보낸 메세지 삭제
export const deleteSendMessage = async (item: DeleteMessage) => {
  deleteDoc(doc(dbService, `message/send/${item.uid}/${item.id}`));
};

// 내 게시물 가져오기
export const getMyPost = async ({ queryKey }: any) => {
  const [_, id] = queryKey;
  const data: any[] = [];
  const q = query(collection(dbService, 'post'), where('creator', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

// 메세지 확인
export const checkedMessageData = async (data: any) => {
  await updateDoc(doc(dbService, `message/take/${data.user}/${data.id}`), {
    checked: true,
  });
};
