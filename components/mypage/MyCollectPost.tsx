import React from 'react';

export default function MyCollectPost({
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
