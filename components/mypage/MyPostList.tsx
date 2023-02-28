import { getData } from '@/api';
import { authService } from '@/firebase';

import { useQuery } from 'react-query';
import Masonry from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';
import Town from './Town';

const MyPostList = ({ setMore, more }: any) => {
  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery('data', getData);
  //* 전체에서 가져온 데이터에서 내가 작성한 포스터들만 가져왔다.
  const myPostList = data?.map((item: any) => {
    if (item.creator === authService.currentUser?.uid) {
      return item.id;
    }
  });

  // * 포스터 data중 내가 만든 것
  const categoryId = data?.filter((item: any) => myPostList?.includes(item.id));
  //* 만든 것 중 town 값만 고르기
  const myCollectPost = categoryId?.filter((item: any) => {
    return item.town;
  });
  //* town값을 골라 map 돌리기
  const myCollectPostTown = myCollectPost?.map((item: any) => {
    return item.town;
  });
  //* 배열에서 중복된 값 합치기
  const myCollectTownArr = myCollectPostTown?.filter(
    (element: any, index: any) => {
      return myCollectPostTown?.indexOf(element) === index;
    }
  );

  return (
    <>
      <Masonry columnsCount={3} style={{ gap: '45px' }}>
        {myCollectTownArr?.map((item: any) => (
          <div key={uuidv4()}>
            <Town value={item} />
          </div>
        ))}
      </Masonry>
    </>
  );
};

export default MyPostList;
