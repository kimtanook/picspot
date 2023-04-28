import { getFollow, getUser } from '@/api';
import { authService } from '@/firebase';
import { uuidv4 } from '@firebase/util';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';

function FollowerRankList() {
  const { data: rankFollower } = useQuery(['rankFollwer'], getFollow, {
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
  console.log('rankFollowerData', rankFollowerData);
  console.log('What', authService.currentUser?.uid);
  const myRankNum = rankFollowerData?.map((item: any, index: any) => {
    if (item.docId === authService.currentUser?.uid) return index;
  });
  console.log('myRankNum', myRankNum);
  const myRanking: any = myRankNum?.filter((item: any) => item > -1);
  console.log('myRanking', myRanking);
  const preRank = rankFollower?.slice(myRanking - 1, myRanking);
  console.log('preSlice', preRank);
  const myRank = rankFollower?.filter((item: any) => {
    if (item.docId === authService.currentUser?.uid) {
      return item;
    }
  });
  console.log('myRank', myRank);
  const nextRank = rankFollower?.slice(myRanking, myRanking + 1);
  console.log('nextRank', nextRank);
  const nextRankNum = nextRank?.filter((item: any, index: any) => index === 1);
  console.log('nextRankNum', nextRankNum);
  const { data: rankUser } = useQuery(['rankUser'], getUser, {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 15,
  });

  const topFour = rankFollowerData?.slice(0, 3);
  const fromOneToTen = rankFollowerData?.slice(0, 10);
  const fromElevenToTwenty = rankFollowerData?.slice(10, 20);

  console.log('rankUser', rankUser);

  return (
    <div>
      <TopThreeWrap>
        {topFour?.map((item: any, index: any) => (
          <TopFourItemBox key={uuidv4()}>
            <TopFourItem>
              {rankUser?.map((user: { [key: string]: string }) => (
                <div key={uuidv4()}>
                  {user.uid === item.docId ? (
                    <>
                      {index === 0 ? (
                        <Image
                          src="/CrownFollow.png"
                          alt="crownFollowImg"
                          priority={true}
                          width={60}
                          height={34}
                          style={{
                            margin: '-37px 0 0 18px',
                            position: 'absolute',
                          }}
                        />
                      ) : null}
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
              {/* <RankTitle>칭호</RankTitle> */}
              <Hr />
              <TopFourCount>팔로워 수</TopFourCount>
              {item.follow.length}
              <Hr />
              <Link
                href={`userprofile/${item.docId}`}
                style={{ color: 'black', textDecoration: 'none' }}
              >
                <ProfileButton>작성한 게시물 살펴보기</ProfileButton>
              </Link>
            </TopFourItem>
          </TopFourItemBox>
        ))}
      </TopThreeWrap>
      <MyRankTitle>나의 랭킹</MyRankTitle>
      <MyRankBox>
        <MyRankList>
          {preRank?.map((item: any, index: number) => (
            <MyHighRank>
              {rankUser?.map((user: { [key: string]: string }) => (
                <>
                  {user.uid === item.docId ? (
                    <RankText>
                      <div>{myRanking}</div>
                      <RankImg src={user.userImg} />
                      <RankName>{user.userName}</RankName>
                      <div>{item.follow.length} 개</div>
                    </RankText>
                  ) : null}
                </>
              ))}
            </MyHighRank>
          ))}
          {myRank?.map((item: any) => (
            <MyRank>
              <Image
                src="/RankArrow.png"
                alt="RankArrowImg"
                priority={true}
                width={23}
                height={26}
                style={{
                  marginLeft: '-7%',
                  position: 'absolute',
                }}
              />
              {rankUser?.map((user: { [key: string]: string }) => (
                <>
                  {user.uid === item.docId ? (
                    <RankText>
                      <div>{myRanking[0] + 1}</div>
                      <RankImg src={user.userImg} />
                      <RankName>{user.userName}</RankName>
                      <div>{item.follow.length} 개</div>
                    </RankText>
                  ) : null}
                </>
              ))}
            </MyRank>
          ))}
          {nextRankNum?.map((item: any) => (
            <MyLowerRank>
              {rankUser?.map((user: { [key: string]: string }) => (
                <>
                  {user.uid === item.docId ? (
                    <RankText>
                      <div>{myRanking[0] + 2}</div>
                      <RankImg src={user.userImg} />
                      <RankName>{user.userName}</RankName>
                      <div>{item.follow.length} 개</div>
                    </RankText>
                  ) : null}
                </>
              ))}
            </MyLowerRank>
          ))}
        </MyRankList>
      </MyRankBox>
      <TopTwentyTitle>전체랭킹 Top 20</TopTwentyTitle>
      <FollowRankWrap>
        <FromOneToTenBox>
          <TopTwentyRankCategory>
            <RankCategoryRank>랭크</RankCategoryRank>
            <RankCategoryImg>프로필</RankCategoryImg>
            <RankCategoryNickname>닉네임</RankCategoryNickname>
            <RankCategoryPostCount>팔로워 수</RankCategoryPostCount>
          </TopTwentyRankCategory>
          {fromOneToTen?.map((item: any, index: any) => (
            <FollowRankBox key={uuidv4()}>
              <Rank>{index + 1}등</Rank>
              {rankUser?.map((user: { [key: string]: string }) => (
                <div key={uuidv4()}>
                  {user.uid === item.docId ? (
                    <NameImgBox>
                      {index < 3 ? (
                        <TopTwentyUserImgBox>
                          {index === 0 ? (
                            <Image
                              src="/CrownFollow.png"
                              alt="crownFollowImg"
                              priority={true}
                              width={30}
                              height={13}
                              style={{
                                marginTop: '-17px',
                                position: 'absolute',
                              }}
                            />
                          ) : null}
                          <TopTwentyRingTitle>
                            <TopTwentyRankNum>#{index + 1}</TopTwentyRankNum>
                          </TopTwentyRingTitle>
                          <TopTwentyUserRing />
                          <TopTwentyUserImg src={user.userImg} />
                        </TopTwentyUserImgBox>
                      ) : (
                        <TopTwentyUserImgBox>
                          <TopTwentyUserImg src={user.userImg} />
                        </TopTwentyUserImgBox>
                      )}
                      <TopTwentyRankName>{user.userName}</TopTwentyRankName>
                      <TopTwentyRankTitle>칭호</TopTwentyRankTitle>
                    </NameImgBox>
                  ) : null}
                </div>
              ))}
              <FollowCount>{item.follow.length}개</FollowCount>
            </FollowRankBox>
          ))}
        </FromOneToTenBox>
        <FromElevenToTwentyBox>
          <TopTwentyRankCategory>
            <RankCategoryRank>랭크</RankCategoryRank>
            <RankCategoryImg>프로필</RankCategoryImg>
            <RankCategoryNickname>닉네임</RankCategoryNickname>
            <RankCategoryPostCount>팔로워 수</RankCategoryPostCount>
          </TopTwentyRankCategory>
          {fromElevenToTwenty?.map((item: any, index: any) => (
            <FollowRankBox key={uuidv4()}>
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
              <FollowCount>{item.posts.length}개</FollowCount>
            </FollowRankBox>
          ))}
        </FromElevenToTwentyBox>
      </FollowRankWrap>
    </div>
  );
}

export default FollowerRankList;
const TopThreeWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const MyRankBox = styled.div`
  display: flex;
`;

const MyRankTitle = styled.div`
  color: #212121;
  width: 140px;
  height: 26px;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 24px;
`;

const MyRankList = styled.div`
  margin: 50px auto;
  text-align: -webkit-center;
  font-size: 20px;
`;

const RankText = styled.div`
  width: 100%;
  height: 100%;
  padding: 3%;
  justify-content: left;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 20px;
  font-weight: 700;
`;

const RankImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
const RankName = styled.div`
  width: 70%;
  font-weight: 600;
  text-align: left;
`;

const MyHighRank = styled.div`
  width: 583px;
  height: 78px;
  padding: 3px;
  align-items: center;
  margin: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  border-radius: 15px;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(0deg, #c2c2c2ab 0%, #a4a4a4 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;
const MyRank = styled.div`
  width: 613px;
  height: 82px;
  padding: 3px;
  align-items: center;
  margin: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  border-radius: 15px;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(0deg, #00b9f5 0%, #31d3bd 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;
const MyLowerRank = styled.div`
  width: 583px;
  height: 78px;
  padding: 3px;
  align-items: center;
  margin: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  border-radius: 15px;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(0deg, #a4a4a4 0%, #c2c2c2ab 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
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
  background-image: linear-gradient(310deg, #1882ff 0%, #009f91 100%);
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
    linear-gradient(310deg, #1882ff 0%, #009f91 100%);
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
  margin-top: 13px;
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
  color: #212121;
  width: 140px;
  height: 26px;
  font-weight: 700;
  font-size: 20px;
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
const FollowRankWrap = styled.div`
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
const FollowRankBox = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4px 0 4px 0;
  padding: 0px 12px 0 12px;
  height: 64px;
  border-bottom: 1px solid #d9d9d9;
`;
const Rank = styled.div`
  width: 42px;
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
const TopTwentyRingTitle = styled.div`
  width: 18px;
  height: 14.5px;
  border-radius: 28px;
  background-image: linear-gradient(310deg, #1882ff 0%, #009f91 100%);
  position: absolute;
  margin: -5px 0px 0px 38px;
  z-index: 1;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const TopTwentyRankNum = styled.div`
  color: white;
  font-size: 2px;
  text-align: center;
  margin-top: 2px;
`;

const TopTwentyUserRing = styled.div`
  margin-top: -3.5px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: tomato;
  z-index: -1;
  border: 4px solid transparent;
  background-image: linear-gradient(#d9d9d9, #d9d9d9),
    linear-gradient(310deg, #1882ff 0%, #009f91 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  position: absolute;
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

const FollowCount = styled.div`
  width: 100px;
  line-height: 62px;
  text-align: center;
`;
