import React, { useEffect, useState } from 'react';
import SearchPlace from './SearchPlace';

declare global {
  interface Window {
    kakao: any;
  }
}

const LandingPage = ({ searchPlace }: any) => {
  const [saveLatLng, setSaveLatLng] = useState([]);
  useEffect(() => {
    const { kakao } = window;
    // let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(33.37713123240438, 126.54331893240735),

        level: 10,
      };
      const map = new kakao.maps.Map(container, options);
      // 장소 검색 객체를 생성
      const ps = new kakao.maps.services.Places();
      //키워드로 장소를 검색
      ps.keywordSearch(searchPlace, placeSearchDB);
      //키워드 검색 완료 시 호출되는 콜백함수
      function placeSearchDB(data: any, status: any, pagination: any) {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가
          let bounds = new kakao.maps.LatLngBounds();

          for (let i = 0; i < data.length; i++) {
            // displayMarker();
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          map.setBounds(bounds);
        }
      }
      //   function displayMarker() {
      //
      //   }
      // 마커 생성 후 위도 경도 받기
      const marker = new kakao.maps.Marker({
        position: map.getCenter(),
      });
      marker.setMap(map);
      kakao.maps.event.addListener(map, 'click', function (mouseEvent: any) {
        const latlng = mouseEvent.latLng;
        marker.setPosition(latlng);
        setSaveLatLng(latlng);
      });
    });
  }, [searchPlace]);
  console.log(saveLatLng);
  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default LandingPage;
