import Link from 'next/link';

const Content = ({ item }: any) => {
  console.log('item : ', item);
  return (
    <div>
      <Link href={`/detail/${item.id}`}>
        <div>Content component</div>
      </Link>
    </div>
  );
};
export default Content;
