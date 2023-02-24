import Link from 'next/link';
import styled from 'styled-components';

const Content = ({ item }: any) => {
  return (
    <Link href={`/detail/${item.id}`}>
      <ImageWrap>
        <PostImage src={item?.imgUrl} />
      </ImageWrap>
    </Link>
  );
};
export default Content;
const ImageWrap = styled.div`
  margin: 0 5px 0 5px;
`;
const PostImage = styled.img`
  width: 100%;
`;
