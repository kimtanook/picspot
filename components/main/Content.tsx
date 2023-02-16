import Image from 'next/image';
import Link from 'next/link';

const Content = ({ item }: any) => {
  return (
    <div>
      <Link href={`/detail/${item.id}`}>
        <div>{item.title}</div>
        <div>address : {item.address}</div>
        <div>city : {item.city}</div>
        <div>town : {item.town}</div>
        {/* <div>{item.clickCounter}</div> */}
        {/* <div>{item.createdAt}</div> */}
        {/* <div>{item.creator}</div> */}
        {/* <div>{item.lat}</div> */}
        {/* <div>{item.long}</div> */}
        {/* <Image src={item?.imgUrl} width={100} height={100} alt="image" /> */}
      </Link>
    </div>
  );
};
export default Content;
