import { dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import UserItem from './UserItem';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import Link from 'next/link';

const UserCollectionTown = ({
  value,
  postList,
}: {
  value: string;
  postList: { [key: string]: string | number }[] | undefined;
}) => {
  const [more, setMore] = useState(true);

  // town과 현재 town value가 같은 게시글 추출
  const townSameValueData = postList?.filter(
    (item: userItem) => item.town === value
  );

  const onClickMoreBtn = () => {
    setMore(!more);
  };

  return (
    <div>
      {more ? (
        <TownWrap>
          <PostTownTitle>
            <CollectorTownTitle>{value}</CollectorTownTitle>
          </PostTownTitle>
          <MySpotImg>
            <Masonry columnsCount={2} style={{ gap: '10px' }}>
              {townSameValueData?.map((item: any) => (
                <UserItem key={uuidv4()} item={item} />
              ))}
            </Masonry>
          </MySpotImg>
          <MoreBtn onClick={onClickMoreBtn}>
            <MoreBtnContents>
              more
              <ArrowImg src={'/right-arrow.png'} />
            </MoreBtnContents>
          </MoreBtn>
        </TownWrap>
      ) : (
        <>
          <FatherDiv>
            <MoreDiv>
              <MorePostTownTitle>
                <MoreMyPostTownTitle>{value}</MoreMyPostTownTitle>
              </MorePostTownTitle>
              <GridBox>
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 425: 1, 750: 2, 900: 3, 1200: 4 }}
                >
                  <Masonry columnsCount={4}>
                    {townSameValueData?.map((item: any) => (
                      <Link key={uuidv4()} href={`/detail/${item.id}`}>
                        <MyPostImg src={item.imgUrl} />
                      </Link>
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
              </GridBox>
              <MoreBtn onClick={onClickMoreBtn}>
                <MoreBtnContents>
                  <ArrowImg src={'/arrow-left.png'} />
                  back
                </MoreBtnContents>
              </MoreBtn>
            </MoreDiv>
          </FatherDiv>
        </>
      )}
    </div>
  );
};

export default UserCollectionTown;

const GridBox = styled.div`
  margin: 0px 1%;
  width: 100%;

  @media ${(props) => props.theme.mobile} {
    width: 100%;
  }
`;

const TownWrap = styled.div`
  width: 95%;
  height: 352px;
  margin: 0px 1px 30px 1px;

  :hover {
    transition: all 0.7s;
    transform: scale(1.01);
  }
  @media ${(props) => props.theme.mobile} {
    width: 90%;
    margin-bottom: 10px;
    margin: auto;
  }
`;

const PostTownTitle = styled.div`
  height: 43px;
  border-bottom: 1px solid #212121;
  margin-right: 3%;
`;
const CollectorTownTitle = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-size: 20px;
  line-height: 30px;
  text-align: left;
  font-weight: 500;
  letter-spacing: -0.015em;
`;

const MySpotImg = styled.div`
  width: 97%;
  margin-top: 24px;
  height: 256px;
  overflow: hidden;
  display: grid;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
  }
`;

const MoreBtn = styled.button`
  width: 35px;
  height: 22px;
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  align-items: center;
  text-align: center;
  text-decoration-line: underline;
  float: right;
  margin-top: 20px;
  border: none;
  background-color: white;
  margin-right: 25px;
  :hover {
    font-size: 15px;
    transition: all 0.3s;
  }
`;

const FatherDiv = styled.div`
  background-color: white;
  width: 70%;
  height: 100%;

  @media ${(props) => props.theme.mobile} {
    width: 100%;
    height: 1000px;
  }
`;

const MoreDiv = styled.div`
  background-color: white;
  z-index: 100;
  position: absolute;
  width: 83%;
  transform: translate(-50%, 0%);
  left: 50vw;
  overflow: hidden;
  height: 1000px;
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    width: 90%;
    overflow: auto;
    margin: auto;
    left: 50%;
    height: 100%;
  }
`;
const MyPostImg = styled.img`
  width: 275px;
  margin-bottom: 13px;
  :hover {
    transition: all 0.3s;
    transform: scale(1.02);
  }
  @media ${(props) => props.theme.mobile} {
    width: 90%;
    margin: auto;
    padding: 5px;
  }
`;

const MorePostTownTitle = styled.div`
  height: 43px;
  border-bottom: 1px solid #212121;
  margin-bottom: 25px;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
    margin: auto;
    margin-bottom: 10px;
  }
`;

const MoreMyPostTownTitle = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-size: 20px;
  line-height: 30px;
  text-align: left;
  font-weight: 500;
  letter-spacing: -0.015em;
`;

const MoreBtnContents = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ArrowImg = styled.img`
  width: 12px;
  height: 12px;
  align-items: flex-end;
`;
