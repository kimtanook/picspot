import Header from '@/components/Header';
import {
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
import CollectionButton from '@/components/detail/CollectionButton';

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
  const [isOpen, setIsOpen] = useState(false);

  //* useQuery 사용해서 데이터 불러오기
  const { data: detail, isLoading, isError } = useQuery('detailData', getData);

  const queryClient = useQueryClient();

  //* mutation 사용해서 counting값 보내기
  const { mutate: countMutate } = useMutation(postCounter, {
    onSuccess: () => {
      queryClient.invalidateQueries('detailData');
    },
  });
  //* 변화된 counting 값 인지
  useEffect(() => {
    countMutate(id);
  }, []);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <>
      <Seo title="Detail" />
      {detail
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
              <CollectionButton item={item} />
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
