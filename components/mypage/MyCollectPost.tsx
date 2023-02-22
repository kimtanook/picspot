import Image from 'next/image';
import React from 'react';

export default function MyCollectPost({
  item,
}: {
  item: { [key: string]: string };
}) {
  return (
    <div>
      <Image src={item?.imgUrl} alt="image" height={100} width={162.48} />
    </div>
  );
}
