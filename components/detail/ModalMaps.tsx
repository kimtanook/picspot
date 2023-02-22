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
                          <StOverLayHoverWrap>
                            <StOveLayHoverIcon>이동 아이콘</StOveLayHoverIcon>
                            <StOverLayHoverText>글 보러가기</StOverLayHoverText>
                          </StOverLayHoverWrap>
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
  position: relative;
  width: 100%;
  height: 150px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
`;

const StOverLayImgSrc = styled(Image)`
  width: 100%;
  cursor: pointer;
`;
const StOverLayAddress = styled.div`
  color: gray;
  font-size: 15px;
  position: relative;
  margin-top: 10px;
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

const StOverLayHoverWrap = styled.div`
  color: #fff;
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 150px;
  padding: 20px;

  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.35s ease-in-out;

  :hover {
    opacity: 1;
  }
`;

const StOveLayHoverIcon = styled.h3`
  font-size: 16px;
  padding-bottom: 0.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
  text-align: center;
`;

const StOverLayHoverText = styled.h2`
  font-size: 16px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
`;
export default ModalMaps;
