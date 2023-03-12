import { getMyPost } from '@/api';
import { postModalAtom } from '@/atom';
import { authService } from '@/firebase';
import Image from 'next/image';
import { useQuery } from 'react-query';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import Town from './Town';

const MyPostList = () => {
  const userUid = authService.currentUser?.uid;
  const [postMapModal, setIsPostMapModal] = useRecoilState(postModalAtom);
  const onClickTogglePostModal = () => {
    setIsPostMapModal(true);
  };
  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery(['data', userUid], getMyPost, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  //* 만든 것 중 town 값만 고르기
  const myCollectPost = data?.filter((item: { town: string }) => {
    return item.town;
  });
  //* town값을 골라 map 돌리기
  const myCollectPostTown = myCollectPost?.map((item: { town: string }) => {
    return item.town;
  });
  //* 배열에서 중복된 값 합치기
  const myCollectTownArr = myCollectPostTown?.filter(
    (element: string, index: number) => {
      return myCollectPostTown?.indexOf(element) === index;
    }
  );

  return (
    <GridBox>
      {myCollectTownArr?.length === 0 ? (
        <EmptyPostBox>
          <Image
            src="/main/empty-icon.png"
            alt="empty-icon"
            className="empty-image"
            width={200}
            height={200}
          />
          <EmptyTitle>아직 게시한 사진이 없어요.</EmptyTitle>
          <EmptyContetnts>멋진 제주여행 사진을 게시해볼까요?</EmptyContetnts>
          <EmptyBtn
            onClick={() => {
              onClickTogglePostModal();
            }}
          >
            게시물 업로드 바로가기
          </EmptyBtn>
        </EmptyPostBox>
      ) : (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 425: 1, 750: 2, 1200: 3 }}
        >
          <Masonry columnsCount={3}>
            {myCollectTownArr?.map((item: string) => (
              <div key={uuidv4()}>
                <Town value={item} myPostData={data} />
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </GridBox>
  );
};

export default MyPostList;

const GridBox = styled.div`
  margin: 0px 1%;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
  }
`;

const EmptyPostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 70%;
  left: 50%;
  padding-top: 10px;
  transform: translate(-50%, -50%);
  & > .empty-image {
    width: 100%;
    height: 100%;
  }
`;

const EmptyTitle = styled.div`
  margin: 24px 0px 15px 0px;
  font-size: 16px;
  font-weight: 500;
`;

const EmptyContetnts = styled.div`
  font-size: 24px;
  font-weight: 700;
  width: 260px;
  text-align: center;
`;
const EmptyBtn = styled.button`
  color: #1882ff;
  border: none;
  border-bottom: 1px solid #1882ff;
  background: none;
  cursor: pointer;
`;
