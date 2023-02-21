import React from 'react';

export default function MyCollectItem({
  item,
}: {
  item: { [key: string]: string };
}) {
  return (
    <div>
      <div>{item?.title}</div>
    </div>
  );
}
