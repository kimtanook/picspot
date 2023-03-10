import { addCollectionData, deleteCollectionData } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

interface CollectData {
  collector: string[];
  imgUrl: string;
  town: string;
  uid: string;
}

const Content = ({ item, userCollectData, collectHover }: any) => {
  const queryClient = useQueryClient();

  const userCollectId = userCollectData?.map(
    (collect: CollectData) => collect.uid
  );
  const userCollectBoolean = userCollectId?.includes(item.id);

  const [collectButton, setCollectButton] = useState(userCollectBoolean);
  //* mutation 사용해서 collector값 보내기
  const { mutate: onAddCollection } = useMutation(addCollectionData, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('userCollectData'), 300);
    },
    onError: () => {},
  });

  //* mutation 사용해서 collector값 삭제하기
  const { mutate: onDeleteCollection } = useMutation(deleteCollectionData, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('userCollectData'), 300);
    },
    onError: () => {},
  });

  //* collection 저장 기능입니다.
  const onClickCollection = () => {
    if (!authService.currentUser?.uid) {
      return alert('로그인이 필요합니다.');
    }
    setCollectButton(!collectButton);
    onAddCollection({
      ...item,
      uid: item.id,
      collector: authService.currentUser?.uid,
      imgUrl: item.imgUrl,
      town: item.town,
    });
  };

  //* collection 삭제 기능입니다.
  const deleteCollection = () => {
    setCollectButton(!collectButton);
    onDeleteCollection({
      ...item,
      uid: item.id,
      collector: authService.currentUser?.uid,
    });
  };

  // 아이템 클릭 시 스크롤 위치 저장
  const saveScroll = () => {
    sessionStorage.setItem('scrollY', String(window.scrollY));
  };
  return (
    <>
      {collectHover ? (
        <>
          {userCollectBoolean ? (
            <DeleteBtn
              src="/main/collect-true.png"
              onClick={deleteCollection}
            />
          ) : (
            <AddBtn src="/main/collect-false.png" onClick={onClickCollection} />
          )}
        </>
      ) : null}
      <Link href={`/detail/${item.id}`}>
        <ImageBox>
          <Image
            src={item?.imgUrl}
            alt="postImg"
            width={252}
            height={300}
            priority={true}
            className="image-box"
            quality={75}
            onClick={saveScroll}
          />
        </ImageBox>
      </Link>
    </>
  );
};
export default Content;

const AddBtn = styled.img`
  position: absolute;
  top: 6%;
  left: 86%;
  z-index: 10;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const DeleteBtn = styled.img`
  position: absolute;
  top: 6%;
  left: 86%;
  z-index: 10;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const ImageBox = styled.div`
  & > .image-box {
    width: 100%;
    height: 100%;
  }
`;
