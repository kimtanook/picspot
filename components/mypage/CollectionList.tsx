// import { getCollection, getData } from '@/api';
// import { authService } from '@/firebase';
// import Image from 'next/image';
// import { useQuery } from 'react-query';
// import styled from 'styled-components';
// import Link from 'next/link';
// import { useState } from 'react';
// import { uuidv4 } from '@firebase/util';
// const CollectionList = ({ postData }: any) => {
//   const [toggle, setToggle]: any = useState(false);
//   //* useQuery 사용해서 collection 데이터 불러오기
//   const { data: collectionData } = useQuery('collectiondata', getCollection);
//   //* collector들 닉네임 뽑아오기
//   //* collector에서 내 id를 가진 값 찾기
//   const collectorList = collectionData?.filter((item: any) => {
//     return item.collector.find((item: any) =>
//       authService.currentUser?.uid.includes(item)
//     );
//   });
//   //* 내 id와 맞는 collector의 uid값 출력
//   const collectorId = collectorList?.map((item: any) => {
//     return item.uid;
//   });

//   //* postData의 id가 collection uid와 같다면 postData id 출력하기
//   const postId = postData?.filter((item: any) =>
//     collectorId?.includes(item.id)
//   );
//   console.log('collectorID', postId);

//   return (
//     <>
//       <button onClick={() => setToggle(!toggle)}>collection 게시물</button>
//       {toggle ? (
//         <Div key={uuidv4()}>
//           {postId?.map((item: any) => (
//             <Link href={`/detail/${item.id}`}>
//               <CollectionBox>
//                 <div>{item.title}</div>
//                 <div>{item.nickname}</div>
//                 <div>{item.town}</div>
//                 <Image src={item.imgUrl} alt="image" height={100} width={100} />
//               </CollectionBox>
//             </Link>
//           ))}
//         </Div>
//       ) : (
//         <h2>위 버튼을 클릭하면 저장한 게시물들이 나옵니다</h2>
//       )}
//     </>
//   );
// };
// export default CollectionList;
// const Div = styled.div`
//   display: flex;
//   flex-direction: row;
//   overflow-x: scroll;
// `;
// const CollectionBox = styled.div`
//   display: grid;
//   width: 200px;
//   height: 200px;
//   border: 1px solid tomato;
//   margin: 10px;
// `;

import { getCollection, getData, getTownData, getTownDataJeju } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { uuidv4 } from '@firebase/util';
import Town from './Town';
import CollectionCategory from './CollectionCategory';
import Masonry from 'react-responsive-masonry';

const CollectionList = ({ postData }: any) => {
  //* useQuery 사용해서 collection 데이터 불러오기
  const { data: collectionData } = useQuery('collectiondata', getCollection);
  //* collector들 닉네임 뽑아오기
  //* collector에서 내 id를 가진 값 찾기
  const collectorList = collectionData?.filter((item: any) => {
    return item.collector.find((item: any) =>
      authService.currentUser?.uid.includes(item)
    );
  });
  //* 내 id와 맞는 collector의 uid값 출력
  const collectorId = collectorList?.map((item: any) => {
    return item.uid;
  });

  //* postData의 id가 collection uid와 같다면 postData id 출력하기
  const postId = postData?.filter((item: any) =>
    collectorId?.includes(item.id)
  );
  // console.log('collectorID', postId);

  //* 내 collection의 postId중 town값만 출력
  const myCollectionTown = postId?.map((item: any) => {
    return item.town;
  });
  //* 배열에서 중복된 값 합치기
  let myCollectionTownArr = [...new Set(myCollectionTown)];

  // console.log('게시물들', myCollectionTownArr);
  return (
    <>
      <Masonry columnsCount={3} style={{ gap: '45px' }}>
        {myCollectionTownArr?.map((item: any) => (
          <CollectionCategory
            value={item}
            postData={postData}
            collectionData={collectionData}
          />
        ))}
      </Masonry>
    </>
  );
};

export default CollectionList;
