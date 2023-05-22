import Header from '@/components/Header';
import CommentRankList from '@/components/rank/CommentRankList';
import FollowerRankList from '@/components/rank/FollowerRankList';
import PostRankList from '@/components/rank/PostRankList';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';

function Index() {
  const [category, setCategory] = useState('post');
  const isMobile = useMediaQuery({ maxWidth: 413 });
  const router = useRouter();
  return (
    <Wrap>
      {/* {isMobile ? (
        <MobileHeader>
          <Back onClick={() => router.push('/main')}>
            <BackArrow src="/Back-point.png" alt="image" />
          </Back>
        </MobileHeader>
      ) : ( */}
      <>
        <Header
          selectCity={undefined}
          onChangeSelectCity={undefined}
          searchOptionRef={undefined}
          searchValue={undefined}
          onChangeSearchValue={undefined}
        />
      </>
      {/* )} */}

      <CategoryWrap>
        <RankCategory
          category={category}
          name="post"
          onClick={() => setCategory('post')}
        >
          게시물 랭킹
        </RankCategory>
        <RankCategory
          category={category}
          name="comment"
          onClick={() => setCategory('comment')}
        >
          댓글 랭킹
        </RankCategory>
        <RankCategory
          category={category}
          name="follower"
          onClick={() => setCategory('follower')}
        >
          팔로워 랭킹
        </RankCategory>
      </CategoryWrap>
      <div>
        {category === 'post' ? (
          <PostRankList />
        ) : category === 'comment' ? (
          <CommentRankList />
        ) : (
          <FollowerRankList />
        )}
      </div>
    </Wrap>
  );
}

export default Index;
const MobileHeader = styled.div`
  width: 100vw;
  height: 60px;
  padding: 30px;
`;

const Back = styled.div`
  width: 30px;
`;

const BackArrow = styled.img`
  width: 12px;
  height: 28px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CategoryWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin: 40px 0 80px 0;
  @media ${(props) => props.theme.mobile} {
    margin: 10px 0 30px 0;
  }
`;
const RankCategory = styled.div<{ category: string; name: string }>`
  cursor: pointer;
  width: 94px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-bottom: 3px solid
    ${(props) => (props.category === props.name ? '#1882FF' : '#8E8E93')};
  color: ${(props) => (props.category === props.name ? '#1882FF' : '#8E8E93')};
  margin: 4px;
`;
