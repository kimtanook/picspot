import styled from 'styled-components';
import Masonry from 'react-responsive-masonry';
import { uuidv4 } from '@firebase/util';
import UserCollectItem from './UserItem';
import { useState } from 'react';
import Link from 'next/link';

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
            <Masonry columnsCount={2} style={{ paddingRight: '25px' }}>
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
              <Masonry columnsCount={4}>
                {userPostTownList?.map((item: any) => (
                  <Link key={uuidv4()} href={`/detail/${item.id}`}>
                    <MyPostImg src={item.imgUrl} />
                  </Link>
                ))}
              </Masonry>
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

const TownWrap = styled.div`
  width: 365px;
  height: 352px;
  margin: 0px 1px 30px 1px;
  padding-right: 25px;
`;
const PostTownTitle = styled.div`
  height: 43px;
  border-bottom: 1px solid #212121;
  margin-right: 13px;
`;

const UserPostTownTitle = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-size: 20px;
  line-height: 30px;
  text-align: left;
  font-weight: 500;
  letter-spacing: -0.015em;
`;
const UserPostImgWrap = styled.div`
  width: 390px;
  margin-top: 24px;
  height: 256px;
  overflow: hidden;
  display: grid;
`;

const FatherDiv = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vw;
  position: absolute;
  left: 1px;
  overflow: hidden;
`;
const MoreDiv = styled.div`
  background-color: white;
  z-index: 100;
  position: absolute;
  width: 1188px;
  transform: translate(-50%, 0%);
  left: 50%;
  overflow: hidden;
`;
const MyPostImg = styled.img`
  width: 275px;
  margin-bottom: 13px;
  :hover {
    transition: all 0.3s;
    transform: scale(1.02);
  }
`;

const MorePostTownTitle = styled.div`
  height: 43px;
  border-bottom: 1px solid #212121;
  margin-bottom: 25px;
`;

const MoreMyPostTownTitle = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-size: 20px;
  line-height: 30px;
  text-align: left;
  font-weight: 500;
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
  background-color: white;
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
