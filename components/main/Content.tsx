import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

const Content = ({ item }: any) => {
  return (
    <Link href={`/detail/${item.id}`}>
      <ImageWrap>
        <Image
          src={item?.imgUrl}
          alt="postImg"
          layout="responsive"
          width={50}
          height={50}
          priority={true}
        />
      </ImageWrap>
    </Link>
  );
};
export default Content;
const ImageWrap = styled.div`
  margin: 0 5px 0 5px;
  width: 100%;
  height: 100%;
`;
