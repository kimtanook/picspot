import React, { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const DetailMaps = ({
  searchPlace,
  saveLatLng,
  setSaveLatLng,
  saveAddress,
  setSaveAddress,
  setInfoDiv,
}: any) => {
  useEffect(() => {
    const { kakao } = window;

    //----------------------------카카오맵 셋팅/----------------------------
    kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(33.37713123240438, 126.54331893240735),
        level: 5,
      };
      const map = new kakao.maps.Map(container, options);
      const geocoder = new kakao.maps.services.Geocoder();

      //----------------------------줌 레벨 및 스카이뷰/----------------------------
      const mapTypeControl = new kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      //----------------------------장소 검색/----------------------------

      const ps = new kakao.maps.services.Places(); // 장소 검색 객체를 생성
      ps.keywordSearch(`제주특별자치도 ${searchPlace}`, placeSearchDB); //키워드로 장소를 검색

      function placeSearchDB(data: any, status: any, pagination: any) {
        //키워드 검색 완료 시 호출되는 콜백함수
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해

          let bounds = new kakao.maps.LatLngBounds(); // LatLngBounds 객체에 좌표를 추가

          for (let i = 0; i < data.length; i++) {
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          map.setBounds(bounds);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          // alert(' 제주도 지역명을 검색해주세요.');
        } else if (status === kakao.maps.services.Status.ERROR) {
          // alert('에러입니다.');
        }
      }

      //----------------------------행정동 주소 왼쪽 상단에 올리기/----------------------------
      searchAddrFromCoords(map.getCenter(), displayCenterInfo);

      //----------------------------좌표로 주소를 얻어내기/----------------------------

      function searchDetailAddrFromCoords(coords: any, callback: any) {
        // 좌표로 법정동 상세 주소 정보를 요청합니다
        geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
      }
      //----------------------------마커 생성 후 위도 경도 받기/----------------------------
      const marker = new kakao.maps.Marker({
        position: map.getCenter(),
      });

      kakao.maps.event.addListener(map, 'click', function (mouseEvent: any) {
        const latlng = mouseEvent.latLng;
        searchDetailAddrFromCoords(
          mouseEvent.latLng,
          function (result: any, status: any) {
            marker.setPosition(latlng);
            setSaveLatLng(latlng);
            marker.setMap(map);
            setSaveAddress(result[0]?.address.address_name);
          }
        );
      });

      //----------------------------현재 지도 중심으로 상단에 주소 랜더링/----------------------------
      kakao.maps.event.addListener(map, 'idle', function () {
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);
      });
      function searchAddrFromCoords(coords: any, callback: any) {
        // 좌표로 행정동 주소 정보를 요청합니다
        geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
      }

      function displayCenterInfo(result: any, status: any) {
        if (status === kakao.maps.services.Status.OK) {
          for (var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
              setInfoDiv(result[i].address_name);
              break;
            }
          }
        }
      }
    });
  }, [searchPlace]);

  return <div id="map" style={{ width: '100%', height: '200px' }}></div>;
};

export default DetailMaps;
