import { getDatas, deleteData, updataData } from '@/api';
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
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

//! 이미지 수정 구현하기
export default function Mypage() {
  const queryClient = useQueryClient();

  const [editTitle, setEditTitle] = useState('');
  const [editImgUpload, setEditImgUpload]: any = useState(null);

  let editState: any = {
    title: editTitle,
    imgUrl: '',
  };

  //* useQuery 사용해서 데이터 불러오기
  const { data, isLoading, isError } = useQuery('datas', getDatas);
  console.log('data: ', data);

  //* useMutation 사용해서 데이터 삭제하기
  const { mutate: onDeleteData } = useMutation(deleteData);

  //* 삭제버튼 눌렀을때 실행하는 함수
  const onClickDeleteData = (docId: any) => {
    console.log('삭제버튼을 클릭했습니다.');
    onDeleteData(docId, {
      onSuccess: () => {
        console.log('삭제 요청 성공');
        queryClient.invalidateQueries('datas');
      },
      onError: () => {
        console.log('삭제 요청 실패');
      },
    });
  };

  //* useMutation 사용해서 데이터 수정하기
  const { mutate: onUpdataData } = useMutation(updataData);

  //* 수정버튼 눌렀을때 실행하는 함수
  const onClickUpdateData = (data: any) => {
    console.log('수정버튼을 클릭했습니다.');
    if (editImgUpload === null) {
      alert('이미지를 추가해주세요.');
      return;
    }

    const imageRef = ref(storageService, `images/${editImgUpload.name}`);
    uploadBytes(imageRef, editImgUpload).then((snapshot) => {
      let response;
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        console.log('url: ', url);
        response = url;

        onUpdataData(
          { ...data, imgUrl: response },
          {
            onSuccess: () => {
              console.log('수정 요청 성공');
              queryClient.invalidateQueries('datas');
            },
            onError: () => {
              console.log('수정 요청 실패');
            },
          }
        );
      });
    });
  };

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <div>
      <Seo title="My" />
      <h1>마이페이지임</h1>
      {data.map((item: any) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(event: any) => {
              setEditImgUpload(event.target.files[0]);
            }}
          />
          <input
            onChange={(e) => {
              setEditTitle(e.target.value);
            }}
          />
          <button
            onClick={() => onClickUpdateData({ id: item.id, ...editState })}
          >
            수정
          </button>
          <button onClick={() => onClickDeleteData(item.id)}>삭제</button>
          <Image src={item.imgUrl} alt="image" height={100} width={100} />
        </div>
      ))}
    </div>
  );
}
