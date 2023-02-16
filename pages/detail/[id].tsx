import { getDatas, postCounter } from '@/api';
import Seo from '@/components/Seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import CommentList from '@/components/detail/CommentList';

const Post = ({ id }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  //* useQuery 사용해서 데이터 불러오기
  const { data, isLoading, isError } = useQuery('detailData', getDatas);
  // console.log('data: ', data);
  const queryClient = useQueryClient();

  //* mutation 사용해서 counting값 보내기
  const { mutate: countMutate } = useMutation(postCounter, {
    onSuccess: () => {
      queryClient.invalidateQueries('detailData');
    },
  });

  //* 변화된 counting 값 인지
  useEffect(() => {
    countMutate(id);
    console.log('id:', id);
  }, []);
  console.log('data:', data);
  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  //* split함수로 주소 뽑아오기
  // const testmessage = '제주특별자치도 제주시 법환동';
  // const arr = testmessage.split(' ');
  // console.log(arr[1]);

  //* 뽑아온 주소를 카테고리로 만들고,
  //* city : 정렬[0,1] (제주특별...,제주시 or 서귀포시)
  //* town : 정렬[2] (법환동, 애월리 ... 등등)

  //* input창을 만들어 줘야하나? ( 검색하고 있는 주소가 맞는지??)

  //* 카테고리 클릭시 맵 이동기능 하나
  //* 맵 이동시 카테고리 생성 기능? 하나
  //* 카테고리 만들어 놓고 그 값 클릭시 맵 이동 (하위 카테고리는 town만 해당)

  return (
    <>
      <Seo title="Detail" />
      <div></div>
      {data
        .filter((item: any) => {
          return item.id === id;
        })
        .map((item: any) => {
          console.log('item입니다', item);
          return (
            <StDetailBox key={item.id}>
              <Map // 지도를 표시할 Container
                center={{
                  // 지도의 중심좌표
                  lat: item.lat,
                  lng: item.long,
                }}
                style={{
                  // 지도의 크기
                  width: '100%',
                  height: '450px',
                }}
                level={6} // 지도의 확대 레벨
              >
                <MapMarker // 인포윈도우를 생성하고 지도에 표시합니다
                  position={{
                    // 인포윈도우가 표시될 위치입니다
                    lat: item.lat,
                    lng: item.long,
                  }}
                  clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
                  // 마커에 마우스오버 이벤트를 등록합니다
                  onMouseOver={
                    // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
                    () => setIsOpen(true)
                  }
                  // 마커에 마우스아웃 이벤트를 등록합니다
                  onMouseOut={
                    // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
                    () => setIsOpen(false)
                  }
                >
                  {/* MapMarker의 자식을 넣어줌으로 해당 자식이 InfoWindow로 만들어지게 합니다 */}
                  {/* 인포윈도우에 표출될 내용으로 HTML 문자열이나 React Component가 가능합니다 */}

                  {isOpen && (
                    <StOverLayContainer>
                      <StOverLayTitle>
                        {item.title}
                        <div
                          className="close"
                          onClick={() => setIsOpen(false)}
                          title="닫기"
                        ></div>
                      </StOverLayTitle>
                      <StOverLayContent>
                        <div>
                          <Image
                            src={item.imgUrl}
                            alt="image"
                            height={100}
                            width={100}
                          />
                        </div>
                        <StOverLayAddress>
                          <div>{item.address}</div>
                        </StOverLayAddress>
                      </StOverLayContent>
                    </StOverLayContainer>
                  )}
                </MapMarker>
              </Map>
              <h1>{item.title}</h1>
              <h3>{item.city}</h3>
              <h3>{item.town}</h3>
              <h3>{item.clickCounter}</h3>
              <Image src={item.imgUrl} alt="image" height={100} width={100} />
            </StDetailBox>
          );
        })}
      <CommentList postId={id} />
    </>
  );
};

export default Post;

const StDetailBox = styled.div`
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
`;

const StOverLayContainer = styled.div`
  border: 0.3px solid white;
  border-radius: 3px;
`;

const StOverLayTitle = styled.div`
  font-size: 1.2rem;
  padding: 10px;
  font-weight: 700;
  background-color: lightgray;
`;

const StOverLayContent = styled.div`
  font-size: 18px;
  border-radius: 3px;
  padding: 5px;

  display: flex;
  justify-content: space-between;
`;
const StOverLayAddress = styled.div`
  font-size: 1rem;
  border-radius: 3px;
  padding: 5px;
  /* margin-top: 3%; */
  font-weight: 200;
`;
//* SSR방식으로 server에서 id 값 보내기
export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { id }: any = params;
  return {
    props: {
      id: id,
    },
  };
}
