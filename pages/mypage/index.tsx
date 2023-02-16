import { getDatas, deleteData, updataData, getFollwing } from '@/api';
import PostList from '@/components/mypage/PostList';
import Profile from '@/components/mypage/Profile';
import Seo from '@/components/Seo';
import { authService, storageService } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';

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
  // console.log('data: ', data);

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

    //? 이미지 인풋값이 빈값이면 함수 종료하기
    if (editImgUpload === null) {
      alert('이미지를 추가해주세요.');
      return;
    }

    //? 이미지를 스토리지에 저장하고 url 받아오기
    const imageRef = ref(storageService, `images/${editImgUpload.name}`);
    let response: string;
    uploadBytes(imageRef, editImgUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        // console.log('url: ', url);
        //? 동기적으로 데이터 변경하기
        response = url;
        editState = { ...editState, imgUrl: response };

        //? 데이터 추가하는 트리거 실행하기
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

  //* useQuery 사용해서 following 데이터 불러오기
  const { data: followingData } = useQuery('followingData', getFollwing);
  // console.log('followingData: ', followingData);
  // console.log('authService.currentUser.uid', authService?.currentUser?.uid);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  //* 팔로잉한 사람 uid 뽑아오기
  const newArr: any = [];

  followingData
    .filter((item: any) => {
      return item.uid === authService?.currentUser?.uid;
    })
    .map((item: any) => newArr.push(item.follow));

  console.log('newArr: ', newArr);

  return (
    <MyContainer>
      <MyTextDiv>
        <Seo title="My" />
        <h1>마이페이지입니다</h1>
        <Link href={'/'}>
          <ToMainpage>메인페이지로 돌아가기</ToMainpage>
        </Link>
      </MyTextDiv>
      <MyProfileContainer>
        <Profile />
      </MyProfileContainer>
      <h3>팔로잉 중인사람 uid</h3>
      {followingData
        .filter((item: any) => {
          return item.uid === authService?.currentUser?.uid;
        })
        .map((item: any) => (
          <div key={item.follow}>{item.follow}</div>
        ))}

      <MyProfileListContainer>
        <PostList
          editState={editState}
          data={data}
          setEditImgUpload={setEditImgUpload}
          setEditTitle={setEditTitle}
          onClickUpdateData={onClickUpdateData}
          onClickDeleteData={onClickDeleteData}
        />
      </MyProfileListContainer>
      <MyKeywordContainer>키워드</MyKeywordContainer>
    </MyContainer>
  );
}
const MyContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const MyTextDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ToMainpage = styled.button``;

const MyProfileContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const MyProfileListContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-self: auto;
  overflow: scroll;
`;

const MyKeywordContainer = styled.div`
  display: flex;
  justify-content: center;
`;
