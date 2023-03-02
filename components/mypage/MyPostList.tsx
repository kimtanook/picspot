import { getMyPost } from '@/api';
import { authService } from '@/firebase';
import { useQuery } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import Town from './Town';

const MyPostList = () => {
  const userUid = authService.currentUser?.uid;

  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery(['data', userUid], getMyPost);

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

  const isPc = useMediaQuery({
    query: '(min-width: 425px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 425px)',
  });

  return (
    <GridBox>
      <ResponsiveMasonry columnsCountBreakPoints={{ 425: 1, 750: 2, 1200: 3 }}>
        <Masonry columnsCount={3}>
          {myCollectTownArr?.map((item: string) => (
            <div key={uuidv4()}>
              <Town value={item} myPostData={data} />
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
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
