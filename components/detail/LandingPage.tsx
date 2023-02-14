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

    //----------------------------카카오맵 셋팅/----------------------------
    kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(33.37713123240438, 126.54331893240735),

        level: 9,
      };
      const map = new kakao.maps.Map(container, options);

      //----------------------------줌 레벨 및 스카이뷰/----------------------------
      const mapTypeControl = new kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      //----------------------------장소 검색/----------------------------

      const ps = new kakao.maps.services.Places(); // 장소 검색 객체를 생성

      ps.keywordSearch(searchPlace, placeSearchDB); //키워드로 장소를 검색

      function placeSearchDB(data: any, status: any, pagination: any) {
        //키워드 검색 완료 시 호출되는 콜백함수
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해

          let bounds = new kakao.maps.LatLngBounds(); // LatLngBounds 객체에 좌표를 추가

          for (let i = 0; i < data.length; i++) {
            //   displayMarker();
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          map.setBounds(bounds);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert('지역 + 지명을 검색해주세요.');
          return;
        }
      }
      function displayMarker() {}

      //----------------------------마커 생성 후 위도 경도 받기/----------------------------
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
