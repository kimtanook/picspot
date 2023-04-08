import { getData, getFollowRank, getUser } from '@/api';
import { uuidv4 } from '@firebase/util';
import { useQuery } from 'react-query';
import styled from 'styled-components';

function FollowerRankList() {
  const { data: rankFollower } = useQuery(['rankFollwer'], getFollowRank, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 15,
  });

  const rankFollowerData = rankFollower?.sort((a: any, b: any) => {
    if (a.follow.length < b.follow.length) {
      return 1;
    } else if (a.follow.length > b.follow.length) {
      return -1;
    } else {
      return 0;
    }
  });

  const { data: rankUser } = useQuery(['rankUser'], getUser, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 15,
  });

  return (
    <div>
      {rankFollowerData?.map((item: any, index: any) => (
        <PostRankBox key={uuidv4()}>
          <Rank>{index + 1}등</Rank>
          <Name>
            {rankUser.map((user: { [key: string]: string }) => (
              <div key={uuidv4()}>
                {user.uid === item.docId ? user.userName : null}
              </div>
            ))}
          </Name>
          <PostCount>{item.follow.length}명</PostCount>
        </PostRankBox>
      ))}
    </div>
  );
}

export default FollowerRankList;
const PostRankBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const Rank = styled.div`
  background-color: beige;
  width: 100px;
`;
const Name = styled.div`
  background-color: aqua;
  width: 300px;
`;
const PostCount = styled.div`
  background-color: aquamarine;
  width: 100px;
`;
