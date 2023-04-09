import { getData, getUser } from '@/api';
import { uuidv4 } from '@firebase/util';
import { useQuery } from 'react-query';
import styled from 'styled-components';

function PostRankList() {
  // 모든 포스트 데이터 가져오기
  const { data: rankPost } = useQuery(['rankPost'], getData, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 15,
  });
  console.log('rankPost : ', rankPost);
  // 모든 유저 데이터 가져오기
  const { data: rankUser } = useQuery(['rankUser'], getUser, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 15,
  });

  // 유저 목록 추출
  const users: string[] = Array.from(
    new Set(rankPost?.map((post: RankPost) => post.creator))
  );

  // 유저별 포스트 추출
  let userPosts: RankUserPost[] = users.reduce<RankUserPost[]>((acc, user) => {
    acc.push({
      user,
      posts: rankPost.filter((post: RankPost) => post.creator === user),
    });
    return acc;
  }, []);

  // 유저별 포스트 정렬
  userPosts.sort(function (a, b) {
    if (a.posts.length < b.posts.length) {
      return 1;
    }
    if (a.posts.length > b.posts.length) {
      return -1;
    }
    return 0;
  });
  return (
    <div>
      {userPosts?.map((item, index) => (
        <PostRankBox key={uuidv4()}>
          <Rank>{index + 1}등</Rank>
          <Name>
            {rankUser?.map((user: { [key: string]: string }) => (
              <div key={uuidv4()}>
                {user.uid === item.user ? user.userName : null}
              </div>
            ))}
          </Name>
          <PostCount>{item.posts.length}개</PostCount>
        </PostRankBox>
      ))}
    </div>
  );
}

export default PostRankList;
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
