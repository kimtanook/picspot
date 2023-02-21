import { getCollection, getData, getTownData, getTownDataJeju } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { uuidv4 } from '@firebase/util';

const CollectionList = ({ postData }: any) => {
  const [toggle, setToggle]: any = useState(false);

  //* useQuery 사용해서 collection 데이터 불러오기
  const { data: collectionData } = useQuery('collectiondata', getCollection);

  //* collector들 닉네임 뽑아오기
  //* collector에서 내 id를 가진 값 찾기
  const collectorList = collectionData?.filter((item: any) => {
    return item.collector.find((item: any) =>
      authService.currentUser?.uid.includes(item)
    );
  });
  //* 내 id와 맞는 collector의 uid값 출력
  const collectorId = collectorList?.map((item: any) => {
    return item.uid;
  });

  //* postData의 id가 collection uid와 같다면 postData id 출력하기
  const postId = postData?.filter((item: any) =>
    collectorId?.includes(item.id)
  );

  //* useQuery 사용해서 category 데이터 불러오기
  const { data: categoryCollectionData } = useQuery(
    ['categoryCollectionData'],
    getTownDataJeju
  );
  // console.log('categoryCollectionData', categoryCollectionData);

  //* 우도에서 가져온 데이터에서 내가 작성한 포스터들만 가져왔다.
  const a = categoryCollectionData?.map((item: any) => {
    if (item.creator === authService.currentUser?.uid) {
      return item.id;
    }
  });
  // * 우도에서 가져온 데이터를 post 데이터와 교집합하여 데이터를 꺼냄
  const categoryId = postData?.filter((item: any) => a?.includes(item.id));
  // console.log('이게맞나', categoryId);

  // console.log('first', a);

  const b = categoryCollectionData?.map((item: any) => {
    return item.id;
  });

  //* 우도와 내가 collection한 데이터의 교집합
  const collectCategoryId = collectorId?.filter((item: any) =>
    a?.includes(item)
  );
  // console.log('collectCategoryId', collectCategoryId);

  //* 우도와 내 collection의 교집합의 postData
  const collectCategoryIds = postData?.filter((item: any) =>
    b?.includes(item.id)
  );

  // console.log('collectCategoryIdsssss', collectCategoryIds);
  return (
    <>
      {categoryId?.map((item: any) => (
        <div>{item.town}</div>
      ))}
      <button onClick={() => setToggle(!toggle)}>collection 게시물</button>
      {toggle ? (
        <Div key={uuidv4()}>
          {collectCategoryIds?.map((item: any) => (
            <div>
              <Link href={`/detail/${item.id}`} key={uuidv4()}>
                <CollectionBox key={uuidv4()}>
                  <div key={uuidv4()}>{item.title}</div>
                  <div key={uuidv4()}>{item.nickname}</div>

                  <Image
                    src={item.imgUrl}
                    alt="image"
                    height={100}
                    width={100}
                    key={uuidv4()}
                  />
                </CollectionBox>
              </Link>
            </div>
          ))}
        </Div>
      ) : (
        <h2>위 버튼을 클릭하면 저장한 게시물들이 나옵니다</h2>
      )}
    </>
  );
};

export default CollectionList;

const Div = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
`;

const CollectionBox = styled.div`
  display: grid;
  width: 200px;
  height: 200px;
  border: 1px solid tomato;
  margin: 10px;
`;
