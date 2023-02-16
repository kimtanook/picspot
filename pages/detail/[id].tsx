import {
  addCollectionData,
  deleteCollectionData,
  getCollection,
  getData,
  postCounter,
  getFollwing,
  addFollowing,
  deleteFollwing,
} from '@/api';
import Seo from '@/components/Seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import CommentList from '@/components/detail/CommentList';
import FollowingButton from '@/components/detail/FollowingButton';
import { authService } from '@/firebase';

const Post = ({ id }: any) => {
  //* collection 저장 state
  const [isCollect, setIsCollect] = useState(true);

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
      <Seo title="Detail" />
      {isCollect ? (
        <div>
          <button onClick={onClickCollection}> 담아요 </button>
          <div>이 게시물을 내 collection에 담겠습니까?</div>
        </div>
      ) : (
        <div>
          <button onClick={deleteCollection}> 빼요 </button>
          <div>이 게시물을 내 collection에서 빼겠습니까?</div>
        </div>
      )}
      {detailData
        .filter((item: any) => {
          return item.id === id;
        })
        .map((item: any) => (
          <div key={item.id}>
            <Map // 지도를 표시할 Container
              center={{
                // 지도의 중심좌표
                lat: 33.450701,
                lng: 126.570667,
              }}
              style={{
                // 지도의 크기
                width: '100%',
                height: '450px',
              }}
              level={6} // 지도의 확대 레벨
            />
            <StDetailBox>
              <h1>{item.title}</h1>
              <h3>{item.city}</h3>
              <h3>{item.town}</h3>
              <h3>{item.clickCounter}</h3>
              <Image src={item.imgUrl} alt="image" height={100} width={100} />

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
  padding: 10px;
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
