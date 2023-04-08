import FollowerRankList from '@/components/rank/FollowerRankList';
import PostRankList from '@/components/rank/PostRankList';

function index() {
  return (
    <>
      <div>
        <div>게시물 랭킹</div>
        <PostRankList />
      </div>
      <div>
        <div>팔로워 랭킹</div>
        <FollowerRankList />
      </div>
    </>
  );
}

export default index;
