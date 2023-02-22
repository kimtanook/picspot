import { getData } from '@/api';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  MapTypeControl,
  useMap,
  ZoomControl,
} from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import MapPanTo from './MapPanTo';
const ModalMaps = () => {
  const { data, isLoading, isError } = useQuery('detailData', getData);
  const [isOpen, setIsOpen]: any = useState(false);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  console.log('data', data);

  return (
    <div>
      <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: 33.357055559128746,
          lng: 126.52969312230688,
        }}
        style={{
          // 지도의 크기
          width: '1200px',
          height: '700px',
        }}
        level={10} // 지도의 확대 레벨
      >
        <ZoomControl position={kakao.maps.ControlPosition?.RIGHT} />
        <MapTypeControl position={kakao.maps.ControlPosition?.TOPRIGHT} />
        {data
          // .filter((item: any) => item.town === '우도')
          .map((item: any) => {
            return (
              <div key={item.id}>
                <MapPanTo item={item} setIsOpen={setIsOpen} />
                {isOpen && isOpen.id === item.id && (
                  <CustomOverlayMap
                    position={{
                      // 지도의 중심좌표
                      lat: item.lat,
                      lng: item.long,
                    }}
                  >
                    <StOverLayClose
                      className="close"
                      onClick={() => setIsOpen(false)}
                      title="닫기"
                    ></StOverLayClose>
                    <StOverLayWrap>
                      <StOverLayTitle>{item.title}</StOverLayTitle>

                      <Link href={`/detail/${item.id}`} rel="noreferrer">
                        <StOverLayImg>
                          <StOverLayImgSrc
                            src={item.imgUrl}
                            alt="image"
                            height={150}
                            width={150}
                          />
                        </StOverLayImg>
                      </Link>
                      <StOverLayAddress>
                        {item.address.slice(7, 20)}
                      </StOverLayAddress>
                      <StOverLayCounter>
                        {item.clickCounter} view
                      </StOverLayCounter>
                    </StOverLayWrap>
                  </CustomOverlayMap>
                )}
              </div>
            );
          })}
      </Map>
    </div>
  );
};

const StOverLayWrap = styled.div`
  width: 172px;
  height: 256px;
  margin-top: -300px;
  background-color: white;
  box-shadow: 2.5px 5px 5px gray;
  border-radius: 3px;
  overflow: hidden;
`;

const StOverLayTitle = styled.div`
  padding: 15px 0 0 10px;
  height: 30px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const StOverLayImg = styled.div`
  position: absolute;
  overflow: hidden;
  width: 100%;
`;

const StOverLayImgSrc = styled(Image)`
  width: 100%;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const StOverLayAddress = styled.div`
  color: gray;
  font-size: 15px;
  position: relative;
  margin-top: 160px;
  text-align: center;
`;

const StOverLayCounter = styled.div`
  font-size: 15px;
  color: cornflowerblue;
  font-weight: 600;
  text-align: center;
`;

const StOverLayClose = styled.div`
  position: absolute;
  top: -330px;
  right: 45%;
  border-radius: 25px;
  width: 17px;
  height: 17px;

  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');
  :hover {
    cursor: pointer;

    width: 17px;
    height: 17px;
    border-radius: 25px;
  }
`;

// const StOverLayInfo = styled.div`
//   width: 144px;
//   height: 300px;
//   border-radius: 5px;
//   border-bottom: 2px solid #ccc;
//   border-right: 1px solid #ccc;
//   overflow: hidden;
//   background: #fff;
//   position: absolute;

//   :nth-child(1) {
//     border: 0;
//     box-shadow: 0px 1px 2px #888;
//   }
//   ::after {
//     content: '';
//     position: absolute;
//     margin-left: -12px;
//     left: 50%;
//     bottom: 0;
//     width: 22px;
//     height: 12px;
//     background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png');
//   }
//   .link {
//     color: #5085bb;
//   }
// `;

// const StOverLayBody = styled.div`
//   position: relative;
//   overflow: hidden;
//   cursor: inherit;
// `;

// const StOverLayEllipsis = styled.div`
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// `;

// const StOverLayLink = styled.a`
//   color: inherit;
//   text-decoration: none;
// `;
export default ModalMaps;
