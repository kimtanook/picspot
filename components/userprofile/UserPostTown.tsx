import { uuidv4 } from '@firebase/util';
import Link from 'next/link';
import { useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import styled from 'styled-components';
import UserCollectItem from './UserItem';

const UserTown = ({
  town,
  postList,
}: {
  town: string;
  postList: { [key: string]: string | number }[] | undefined;
}) => {
  const [more, setMore] = useState(true);

  const userPostTownList = postList?.filter((item) => item.town === town);

  //* 더보기 버튼
  const onClickMoreBtn = () => {
    setMore(!more);
  };
  return (
    <div>
      {more ? (
        <TownWrap>
          <PostTownTitle>
            <UserPostTownTitle>{town}</UserPostTownTitle>
          </PostTownTitle>
          <UserPostImgWrap>
            <Masonry columnsCount={2} style={{ gap: '10px' }}>
              {userPostTownList?.map((item: userItem) => (
                <UserCollectItem key={uuidv4()} item={item} />
              ))}
            </Masonry>
          </UserPostImgWrap>
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
                <MoreMyPostTownTitle>{town}</MoreMyPostTownTitle>
              </MorePostTownTitle>
              <GridBox>
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 425: 1, 750: 2, 900: 3, 1200: 4 }}
                >
                  <Masonry columnsCount={4}>
                    {userPostTownList?.map((item: any) => (
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

export default UserTown;

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

const UserPostTownTitle = styled.div`
  font-size: 16px;
  line-height: 38px;
  text-align: left;
  font-weight: 700;
  letter-spacing: -0.015em;
`;
const UserPostImgWrap = styled.div`
  width: 97%;
  margin-top: 12px;
  height: 256px;
  overflow: hidden;
  display: grid;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
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
  margin-bottom: 12px;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
    margin: auto;
    margin-bottom: 10px;
  }
`;

const MoreMyPostTownTitle = styled.div`
  font-size: 16px;
  line-height: 38px;
  text-align: left;
  font-weight: 700;
  letter-spacing: -0.015em;
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
  background-color: inherit;
  margin-right: 25px;
  :hover {
    font-size: 15px;
    transition: all 0.3s;
  }
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
