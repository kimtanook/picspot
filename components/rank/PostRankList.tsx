import { getData, getUser } from '@/api';
import { AuthCurrentUser } from '@/atom';
import { authService } from '@/firebase';
import { uuidv4 } from '@firebase/util';
import { AnyMxRecord } from 'dns';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';

function PostRankList() {
  // 모든 포스트 데이터 가져오기
  const { data: rankPost } = useQuery(['rankPost'], getData, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 15,
  });
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

  // const myRank = userPosts?.filter((item: any) => {
  //   const a = item.user === authService.currentUser?.uid;
  //   return a;
  // });
  // console.log(myRank);

  const topFour = userPosts.slice(0, 4);
  const fromOneToTen = userPosts.slice(0, 10);
  const fromElevenToTwenty = userPosts.slice(10, 20);
  return (
    <div>
      <TopFourWrap>
        {topFour?.map((item, index) => (
          <TopFourItemBox key={uuidv4()}>
            <TopFourItem>
              {rankUser?.map((user: { [key: string]: string }) => (
                <div key={uuidv4()}>
                  {user.uid === item.user ? (
                    <>
                      <TopFourTitle>
                        <TopFourRankNum>#{index + 1}</TopFourRankNum>
                      </TopFourTitle>
                      <TopFourRingDiv>
                        <TopFourUserRing />
                        <TopFourUserImg src={user.userImg} />
                      </TopFourRingDiv>
                      <TopFourName>{user.userName}</TopFourName>
                    </>
                  ) : null}
                </div>
              ))}
              <RankTitle>칭호</RankTitle>
              <Hr />
              <TopFourCount>작성한 게시물</TopFourCount>
              {item.posts.length}
              <Hr />
              <Link
                href={`userprofile/${item.user}`}
                style={{ color: 'black', textDecoration: 'none' }}
              >
                <ProfileButton>작성한 게시물 살펴보기</ProfileButton>
              </Link>
            </TopFourItem>
          </TopFourItemBox>
        ))}
      </TopFourWrap>
      {/* <div>나의 랭킹</div>
      {myRank?.map((item: any) => (
        <div>{item.user}</div>
      ))} */}

      <TopTwentyTitle>전체랭킹 Top 20</TopTwentyTitle>
      <PostRankWrap>
        <FromOneToTenBox>
          <TopTwentyRankCategory>
            <RankCategoryRank>랭크</RankCategoryRank>
            <RankCategoryImg>프로필</RankCategoryImg>
            <RankCategoryNickname>닉네임</RankCategoryNickname>
            <RankCategoryPostCount>게시물 개수</RankCategoryPostCount>
          </TopTwentyRankCategory>
          {fromOneToTen?.map((item, index) => (
            <PostRankBox key={uuidv4()}>
              <Rank>{index + 1}등</Rank>
              {rankUser?.map((user: { [key: string]: string }) => (
                <div key={uuidv4()}>
                  {user.uid === item.user ? (
                    <NameImgBox>
                      <TopTwentyUserImgBox>
                        <TopTwentyUserImg src={user.userImg} />
                      </TopTwentyUserImgBox>
                      <TopTwentyRankName>{user.userName}</TopTwentyRankName>
                      <TopTwentyRankTitle>칭호</TopTwentyRankTitle>
                    </NameImgBox>
                  ) : null}
                </div>
              ))}
              <PostCount>{item.posts.length}개</PostCount>
            </PostRankBox>
          ))}
        </FromOneToTenBox>
        <FromElevenToTwentyBox>
          <TopTwentyRankCategory>
            <RankCategoryRank>랭크</RankCategoryRank>
            <RankCategoryImg>프로필</RankCategoryImg>
            <RankCategoryNickname>닉네임</RankCategoryNickname>
            <RankCategoryPostCount>게시물 개수</RankCategoryPostCount>
          </TopTwentyRankCategory>
          {fromElevenToTwenty?.map((item, index) => (
            <PostRankBox key={uuidv4()}>
              <Rank>{index + 1}등</Rank>
              {rankUser?.map((user: { [key: string]: string }) => (
                <div key={uuidv4()}>
                  {user.uid === item.user ? (
                    <NameImgBox>
                      <TopTwentyUserImgBox>
                        <TopTwentyUserImg src={user.userImg} />
                      </TopTwentyUserImgBox>
                      <TopTwentyRankName>{user.userName}</TopTwentyRankName>
                      <TopTwentyRankTitle>칭호</TopTwentyRankTitle>
                    </NameImgBox>
                  ) : null}
                </div>
              ))}
              <PostCount>{item.posts.length}개</PostCount>
            </PostRankBox>
          ))}
        </FromElevenToTwentyBox>
      </PostRankWrap>
    </div>
  );
}

export default PostRankList;
const TopFourWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const TopFourItemBox = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  width: 278px;
  height: 259px;
  margin: 24px;
`;
const TopFourItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: -10%;
  z-index: 1;
`;

const TopFourTitle = styled.div`
  width: 36px;
  height: 29px;
  border-radius: 28px;
  background-image: linear-gradient(310deg, #00b9f5 0%, #31d3bd 100%);
  position: absolute;
  margin-left: 64px;
  z-index: 1;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const TopFourRankNum = styled.div`
  color: white;
  font-size: 18px;
  text-align: center;
  margin-top: 5px;
`;

const TopFourRingDiv = styled.div`
  position: relative;
  width: 97px;
  height: 97px;
`;

const TopFourUserRing = styled.div`
  width: 97px;
  height: 97px;
  border-radius: 50%;
  background-color: tomato;
  z-index: -1;
  border: 5px solid transparent;
  background-image: linear-gradient(#d9d9d9, #d9d9d9),
    linear-gradient(310deg, #00b9f5 0%, #31d3bd 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  position: absolute;
`;

const TopFourUserImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  z-index: 1000;
  margin: 3px;
`;

const TopFourName = styled.div`
  text-align: center;
`;
const RankTitle = styled.div`
  height: 20px;
  width: 50px;
  text-align: center;
  background-color: gold;
  color: white;
  border-radius: 12px;
`;
const Hr = styled.hr`
  width: 245px;
  height: 1px;
  border: none;
  background-color: #d9d9d9;
`;
const TopFourCount = styled.div`
  color: #8e8e93;
  font-weight: 400;
  font-size: 12px;
`;
const ProfileButton = styled.div`
  cursor: pointer;
  width: 218px;
  height: 38px;
  line-height: 38px;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  margin-top: 12px;
  background-color: #f4f4f4;
`;
const TopTwentyTitle = styled.div`
  color: #8e8e93;
  width: 140px;
  height: 26px;
  font-weight: 700;
  font-size: 20px;
  margin-left: 60px;
  margin-bottom: 24px;
`;
const TopTwentyRankCategory = styled.div`
  background-color: #f4f4f4;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 590px;
  height: 36px;
  padding: 0 12px 0 12px;
`;
const RankCategoryRank = styled.div`
  color: #8e8e93;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  width: 32px;
`;
const RankCategoryImg = styled.div`
  color: #8e8e93;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  width: 62px;
`;
const RankCategoryNickname = styled.div`
  color: #8e8e93;
  padding-left: 12px;
  font-weight: 700;
  font-size: 14px;
  width: 440px;
`;
const RankCategoryPostCount = styled.div`
  color: #8e8e93;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  width: 76px;
  text-align: center;
`;
const PostRankWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const FromOneToTenBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 590px;
  margin: 4px;
`;
const FromElevenToTwentyBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 590px;
  margin: 4px;
`;
const PostRankBox = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4px 0 4px 0;
  padding: 0px 12px 0 12px;
  height: 64px;
  border-bottom: 1px solid #d9d9d9;
`;
const Rank = styled.div`
  width: 32px;
  line-height: 62px;
  text-align: center;
`;
const NameImgBox = styled.div`
  display: flex;
  width: 460px;
  align-items: center;
  margin-top: 12px;
`;
const TopTwentyUserImgBox = styled.div`
  width: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TopTwentyUserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
const TopTwentyRankName = styled.div`
  margin-left: 8px;
`;
const TopTwentyRankTitle = styled.div`
  width: 50px;
  background-color: gold;
  color: white;
  border-radius: 12px;
  margin: 0 12px 0 12px;
  text-align: center;
`;

const PostCount = styled.div`
  width: 100px;
  line-height: 62px;
  text-align: center;
`;
