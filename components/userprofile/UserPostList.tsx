import { getMyPost } from '@/api';
import { useQuery } from 'react-query';
import { uuidv4 } from '@firebase/util';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import UserTown from './UserPostTown';
import styled from 'styled-components';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { postModalAtom } from '@/atom';

const UserPostList = ({ userId }: { userId: string }) => {
  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery(['getUserData', userId], getMyPost, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
  const [postMapModal, setIsPostMapModal] = useRecoilState(postModalAtom);
  //* 현재 프로필 유저가 작성한 포스트들의 town 값 배열
  const townArray = data?.map((item: { town: string }) => item.town);

  //* town 값 배열의 중복 제거
  const uniqueTownArray = townArray?.filter(
    (element: string, index: number) => {
      return townArray?.indexOf(element) === index;
    }
  );

  const onClickTogglePostModal = () => {
    setIsPostMapModal(true);
  };
  return (
    <GridBox>
      {uniqueTownArray?.length === 0 ? (
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
            {uniqueTownArray?.map((item: string) => (
              <div key={uuidv4()}>
                <UserTown town={item} postList={data} />
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </GridBox>
  );
};

export default UserPostList;

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
