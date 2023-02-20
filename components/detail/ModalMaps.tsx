import { getDatas } from '@/api';
import React, { useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useQuery, useQueryClient } from 'react-query';

const ModalMaps = () => {
  const { data, isLoading, isError } = useQuery('detailData', getDatas);
  const queryClient = useQueryClient();
  const [position, setPosition] = useState();
  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;
  console.log('data', data);

  // {data.fileter((item) => item.town === "성산읍").map((item) => <div> .. </div>))}
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
          height: '600px',
        }}
        level={9} // 지도의 확대 레벨
      >
        {data
          .filter((item: any) => item.town === '남원읍')
          .map((item: any) => {
            return (
              <div key="item.id">
                <MapMarker
                  key={item.id}
                  position={{
                    lat: item.lat,
                    lng: item.long,
                  }}
                />
              </div>
            );
          })}
      </Map>
    </div>
  );
};

export default ModalMaps;
