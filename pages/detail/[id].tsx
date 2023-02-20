import { getData, postCounter } from '@/api';
import Seo from '@/components/Seo';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import CommentList from '@/components/detail/CommentList';
import FollowingButton from '@/components/detail/FollowingButton';
import CollectionButton from '@/components/detail/CollectionButton';

const Post = ({ id }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  //* useQuery 사용해서 데이터 불러오기
  const {
    data: detailData,
    isLoading,
    isError,
  } = useQuery('detailData', getData);

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
  }, []);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <>
      <Seo title="Detail" />
      {detailData
        .filter((item: any) => {
          return item.id === id;
        })
        .map((item: any) => (
          <div key={item.id}>
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
              <MapMarker
                position={{
                  // 지도의 중심좌표
                  lat: item.lat,
                  lng: item.long,
                }}
                onClick={() => setIsOpen(true)}
              />
              {isOpen && (
                <CustomOverlayMap
                  position={{
                    // 지도의 중심좌표
                    lat: item.lat,
                    lng: item.long,
                  }}
                >
                  <StOverLayWrap>
                    <StOverLayInfo>
                      <StOverLayTitle>
                        {item.title}
                        <StOverLayClose
                          className="close"
                          onClick={() => setIsOpen(false)}
                          title="닫기"
                        ></StOverLayClose>
                      </StOverLayTitle>
                      <StOverLayBody>
                        <StOverLayImg>
                          <Image
                            src={item.imgUrl}
                            alt="image"
                            height={100}
                            width={100}
                          />
                        </StOverLayImg>
                        <StOverLayDesc>
                          <StOverLayEllipsis>{item.address}</StOverLayEllipsis>
                          <StOverLayCounter>
                            조회수 : {item.clickCounter}
                          </StOverLayCounter>
                          <div>
                            <a
                              href="https://www.kakaocorp.com/main"
                              target="_blank"
                              className="link"
                              rel="noreferrer"
                            >
                              페이지이동(기능추가예정)
                            </a>
                          </div>
                        </StOverLayDesc>
                      </StOverLayBody>
                    </StOverLayInfo>
                  </StOverLayWrap>
                </CustomOverlayMap>
              )}
            </Map>
            <StDetailBox>
              <h1>{item.title}</h1>
              <h3>{item.city}</h3>
              <h3>{item.town}</h3>
              <h3>{item.clickCounter}</h3>
              <Image src={item.imgUrl} alt="image" height={100} width={100} />
              <FollowingButton item={item} />
              <CollectionButton item={item} />
            </StDetailBox>
          </div>
        ))}
      <CommentList postId={id} />
    </>
  );
};

export default Post;

const StDetailBox = styled.div`
  border: 1px solid black;
  padding: 0px;
  margin: 10px;
`;

const StOverLayWrap = styled.div`
  position: absolute;
  left: 0;
  bottom: 50px;
  width: 288px;
  height: 132px;
  margin-left: -144px;
  text-align: left;
  overflow: hidden;
  font-size: 12px;
  font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
  line-height: 1.5;
  padding: 0;
  margin: 20;
`;

const StOverLayInfo = styled.div`
  width: 286px;
  height: 120px;
  border-radius: 5px;
  border-bottom: 2px solid #ccc;
  border-right: 1px solid #ccc;
  overflow: hidden;
  background: #fff;

  :nth-child(1) {
    border: 0;
    box-shadow: 0px 1px 2px #888;
  }
  ::after {
    content: '';
    position: absolute;
    margin-left: -12px;
    left: 50%;
    bottom: 0;
    width: 22px;
    height: 12px;
    background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png');
  }
  .link {
    color: #5085bb;
  }
`;

const StOverLayTitle = styled.div`
  padding: 5px 0 0 10px;
  height: 30px;
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
`;

const StOverLayClose = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #888;
  width: 17px;
  height: 17px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');
  :hover {
    cursor: pointer;
  }
`;

const StOverLayBody = styled.div`
  position: relative;
  overflow: hidden;
  cursor: inherit;
`;

const StOverLayDesc = styled.div`
  position: relative;
  margin: 13px 0 0 90px;
  height: 75px;
`;
const StOverLayEllipsis = styled.div`
  overflow: hidden;
  /* text-overflow: ellipsis; */
  white-space: nowrap;
`;
const StOverLayCounter = styled.div`
  font-size: 11px;
  color: #888;
  margin-top: -2px;
`;
const StOverLayImg = styled.div`
  position: absolute;
  top: 6px;
  left: 5px;
  width: 73px;
  height: 71px;
  border: 1px solid #ddd;
  color: #888;
  overflow: hidden;
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
