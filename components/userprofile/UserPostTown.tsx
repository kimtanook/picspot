import styled from 'styled-components';
import Masonry from 'react-responsive-masonry';
import { uuidv4 } from '@firebase/util';
import UserCollectItem from './UserItem';

const UserTown = ({
  town,
  postList,
}: {
  town: string;
  postList: { [key: string]: string | number }[] | undefined;
}) => {
  const userPostTownList = postList?.filter((item) => item.town === town);
  return (
    <div>
      <TownWrap>
        <PostTownTitle>
          <UserPostTownTitle>{town}</UserPostTownTitle>
        </PostTownTitle>
        <UserPostImgWrap>
          <Masonry columnsCount={2} style={{ gap: '-10px' }}>
            {userPostTownList?.map((item: userItem) => (
              <UserCollectItem key={uuidv4()} item={item} />
            ))}
          </Masonry>
        </UserPostImgWrap>
      </TownWrap>
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
  border-bottom: 2px solid #212121;
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
  overflow-y: scroll;
  display: grid;
`;
