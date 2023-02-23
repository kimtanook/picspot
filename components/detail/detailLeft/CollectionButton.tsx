import {
  addCollectionData,
  deleteCollectionData,
  getCollection,
  visibleReset,
} from '@/api';

import { useEffect, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { authService } from '@/firebase';
import styled from 'styled-components';
import Image from 'next/image';

const CollectionButton = ({ item }: any) => {
  //* 현재 나의 uid
  const collector = authService.currentUser?.uid;
  let postId = item.id;

  const queryClient = useQueryClient();

  //* collection 저장 토글 state
  const [isCollect, setIsCollect] = useState(true);
  //* useQuery 사용해서 collection 데이터 불러오기
  const {
    data: collectionData,
    isLoading,
    isError,
  } = useQuery('collectiondata', getCollection);

  //* mutation 사용해서 collector값 보내기
  const { mutate: onAddCollection } = useMutation(addCollectionData, {
    onSuccess: () => {
      console.log('collection 저장 성공');
      setTimeout(() => queryClient.invalidateQueries('collectiondata'), 500);
    },
    onError: () => {
      console.log('collection 요청 실패');
    },
  });

  //* mutation 사용해서 collector값 삭제하기
  const { mutate: onDeleteCollection } = useMutation(deleteCollectionData, {
    onSuccess: () => {
      console.log('collection 삭제 성공');
      setTimeout(() => queryClient.invalidateQueries('collectiondata'), 500);
    },
    onError: () => {
      console.log('collection 요청 실패');
    },
  });

  //* collection 저장 기능입니다.
  const onClickCollection = () => {
    onAddCollection({
      ...item,
      uid: postId,
      collector: authService.currentUser?.uid,
    });
    setIsCollect(!isCollect);
  };

  //* collection 삭제 기능입니다.
  const deleteCollection = () => {
    onDeleteCollection({
      ...item,
      uid: postId,
      collector: authService.currentUser?.uid,
    });
    setIsCollect(!isCollect);
  };

  //* collector필드의 배열값
  const collectorUid = collectionData
    ?.filter((item: any) => {
      return item.uid === postId;
    })
    .find((item: any) => {
      return item.collector;
    })?.collector;

  console.log('collectorUid: ', collectorUid);

  //* useEffect로 collection 상태 예외처리 하기
  useEffect(() => {
    if (collectorUid?.indexOf(collector) > -1) {
      setIsCollect(false);
    } else {
      setIsCollect(true);
    }
  }, [collectorUid, collector]);

  if (isLoading) return <h1>로딩중 입니다</h1>;
  if (isError) return <h1>통신이 불안정합니다</h1>;
  return (
    <StCollectionContainer>
      {collectorUid ? (
        <StCollectionText>{collectorUid.length}</StCollectionText>
      ) : (
        0
      )}
      {isCollect ? (
        <StCollectionBtn onClick={onClickCollection}>
          <Image src="/before_save.svg" alt="image" width={30} height={30} />
        </StCollectionBtn>
      ) : (
        <StCollectionBtn onClick={deleteCollection}>
          <Image src="/save_icon.svg" alt="image" width={30} height={30} />
        </StCollectionBtn>
      )}
    </StCollectionContainer>
  );
};

export default CollectionButton;

const StCollectionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StCollectionText = styled.div`
  font-size: 12px;
`;

const StCollectionBtn = styled.div`
  cursor: pointer;
  margin-left: 10px;
`;
