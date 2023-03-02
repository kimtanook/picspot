import { getData } from '@/api';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  CustomOverlayMap,
  Map,
  MapTypeControl,
  ZoomControl,
} from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import MapPanTo from './MapPanTo';
import ModalMapsMarker from './ModalMapsMarker';
const ModalMaps = ({ selectTown, selectCity }: any) => {
  const { data, isLoading, isError } = useQuery('bringData', getData);
  const [isOpen, setIsOpen]: any = useState(false);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

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
    </div>
  );
};

export default ModalMaps;
