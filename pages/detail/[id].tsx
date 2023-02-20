import Header from '@/components/Header';
import {
  addCollectionData,
  deleteCollectionData,
  getCollection,
  getData,
  postCounter,
} from '@/api';
import Seo from '@/components/Seo';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import CommentList from '@/components/detail/CommentList';
import FollowingButton from '@/components/detail/FollowingButton';
import { authService } from '@/firebase';
import DetailBox from '@/components/detail/DetailBox';
import DetailMap from '@/components/detail/DetailMap';

const Post = ({ id }: any) => {
  //* DetailMap state
  //? category 클릭, 검색 시 map이동에 관한 통합 state
  const [searchCategory, setSearchCategory]: any = useState('');
  const [saveLatLng, setSaveLatLng]: any = useState([]);
  const [saveAddress, setSaveAddress]: any = useState('');

  // console.log('saveLatLng: ', saveLatLng);
  // console.log('saveAddress: ', saveAddress);

  //? 카테고리버튼 눌렀을 때 실행하는 함수
  const [place, setPlace] = useState('');
  const onClickEditTown = (e: any) => {
    setPlace('');
    setEditTown(e.target.innerText);
    setSearchCategory(e.target.innerText);
  };

  //* DetailBox state
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editTown, setEditTown] = useState('');
  const [imageUpload, setImageUpload]: any = useState(null);

  let editState = {
    title: editTitle,
    content: editContent,
    city: editCity,
    town: editTown,
    imgUrl: '',
    lat: saveLatLng.Ma,
    long: saveLatLng.La,
    address: saveAddress,
  };

  //* input 토글
  const [inputToggle, setInputToggle] = useState(false);

  //* collection 저장 state
  const [isCollect, setIsCollect] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  //* useQuery 사용해서 데이터 불러오기
  const {
    data: detailData,
    isLoading,
    isError,
  } = useQuery('detailData', getData);

  //* useQuery 사용해서 collection 데이터 불러오기
  const {
    data: collectiondata,
    isLoading: isLoadingCollection,
    isError: isErrorCollection,
  } = useQuery('detailData', getCollection);

  const queryClient = useQueryClient();

  //* mutation 사용해서 counting값 보내기
  const { mutate: countMutate } = useMutation(postCounter, {
    onSuccess: () => {
      queryClient.invalidateQueries('detailData');
    },
  });

  //* mutation 사용해서 collector값 보내기
  const { mutate: onAddCollection } = useMutation(addCollectionData, {
    onSuccess: () => {
      console.log('collection 저장 성공');
    },
    onError: () => {
      console.log('collection 요청 실패');
    },
  });

  //* mutation 사용해서 collector값 삭제하기
  const { mutate: onDeleteCollection } = useMutation(deleteCollectionData, {
    onSuccess: () => {
      console.log('collection 삭제 성공');
    },
    onError: () => {
      console.log('collection 요청 실패');
    },
  });

  //* 변화된 counting 값 인지
  useEffect(() => {
    countMutate(id);
  }, []);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  //* collector필드의 value값
  const collector = authService.currentUser?.uid;
  let postId = id;
  //* 만약에 맵을 돌렸을 때 내 이름이 array에 있다면 false 아니면 true

  //* collection 저장 기능입니다.
  const onClickCollection = (item: any) => {
    onAddCollection({ ...item, uid: postId, collector: collector });
    setIsCollect(!isCollect);
  };

  //* collection 삭제 기능입니다.
  const deleteCollection = (item: any) => {
    onDeleteCollection({ ...item, uid: postId, collector: collector });
    setIsCollect(!isCollect);
  };

  // //* collection에 담았는지 안담았는지 확인하는 함수
  // const Lim = collectiondata.map((e: any) => e);
  // const yim = Lim.filter((e: any) => e.id === id);
  // const jaeyoung = yim.map((e: any) => e.collector);
  // const young = jaeyoung.map((e: any) => {
  //   e.filter((collectors: any) => {
  //     if (collectors === collector) {
  //       return 'dd';
  //     }
  //   });
  // });

  return (
    <>
      {isCollect ? (
        <button onClick={onClickCollection}> collection 담기</button>
      ) : (
        <button onClick={deleteCollection}> collection 빼기</button>
      )}
      <Seo title="Detail" />
      <Header />
      {detailData
        .filter((item: any) => {
          return item.id === id;
        })
        .map((item: any) => (
          <div key={item.id}>
            <StDetailBox>
              <DetailMap
                item={item}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                inputToggle={inputToggle}
                searchCategory={searchCategory}
                saveLatLng={saveLatLng}
                setSaveLatLng={setSaveLatLng}
                saveAddress={saveAddress}
                setSaveAddress={setSaveAddress}
                setPlace={setPlace}
                place={place}
              />
              <DetailBox
                item={item}
                inputToggle={inputToggle}
                setInputToggle={setInputToggle}
                setImageUpload={setImageUpload}
                imageUpload={imageUpload}
                editTitle={editTitle}
                editContent={editContent}
                editCity={editCity}
                editTown={editTown}
                editState={editState}
                setEditTitle={setEditTitle}
                setEditContent={setEditContent}
                setEditCity={setEditCity}
                setEditTown={setEditTown}
                setDropdownToggle={setDropdownToggle}
                dropdownToggle={dropdownToggle}
                onClickEditTown={onClickEditTown}
                setSaveLatLng={setSaveLatLng}
                setSaveAddress={setSaveAddress}
              />
              <FollowingButton item={item} />
            </StDetailBox>
          </div>
        ))}
      <CommentList postId={id} />
    </>
  );
};

export default Post;

const StDetailBox = styled.div`
  border: 1px solid black;
  padding: 0px;
  margin: 10px;
`;

//* SSR방식으로 server에서 id 값 보내기
export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { id }: any = params;
  return {
    props: {
      id: id,
    },
  };
}
