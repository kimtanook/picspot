import { getData } from '@/api';
import { townArray } from '@/atom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  CustomOverlayMap,
  Map,
  MapTypeControl,
  ZoomControl,
} from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import MapPanTo from './MapPanTo';
import ModalMapsMarker from './ModalMapsMarker';
const ModalMaps = () => {
  const { data, isLoading, isError } = useQuery('bringData', getData) as any;
  const [isOpen, setIsOpen]: any = useState(false);
  // const isMobile = useMediaQuery({ maxWidth: 766 });
  const isPc = useMediaQuery({ minWidth: 767 });
  const [selectTown, setSelectTown] = useRecoilState(townArray);
  const router = useRouter();
  const selectCity = router.query.city;
  // const [isMobile, setIsMobile] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 766 });

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <MapModalMainWrap>
      {isMobile && (
        <Map // 지도를 표시할 Container
          center={{
            // 지도의 중심좌표
            lat: 33.357055559128746,
            lng: 126.52969312230688,
          }}
          style={{
            // 지도의 크기
            width: '100vw',
            height: '100vh',
            borderRadius: '25px 25px 0px 0px',
            // top: '90px',
          }}
          level={10} // 지도의 확대 레벨
        >
          {/* <ZoomControl position={kakao.maps.ControlPosition?.RIGHT} />
          <MapTypeControl position={kakao.maps.ControlPosition?.TOPRIGHT} /> */}

          {data

            .filter((item: any) =>
              selectTown.length === 0 && selectCity === '제주전체'
                ? true
                : selectTown.length === 0 && item.city === selectCity
                ? true
                : selectTown.includes(item.town)
            )

            .map((item: any) => {
              return (
                <ModalMapsMarker
                  item={item}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  key={item.id}
                />
              );
            })}
        </Map>
      )}

      {isPc && (
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

            .filter((item: any) =>
              selectTown.length === 0 && selectCity === '제주전체'
                ? true
                : selectTown.length === 0 && item.city === selectCity
                ? true
                : selectTown.includes(item.town)
            )

            .map((item: any) => {
              return (
                <ModalMapsMarker
                  item={item}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  key={item.id}
                />
              );
            })}
        </Map>
      )}
    </MapModalMainWrap>
  );
};

const MapModalMainWrap = styled.div`
  @media ${(props) => props.theme.mobile} {
    border-radius: 25%;
  }
`;
export default ModalMaps;
