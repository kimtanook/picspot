import React from 'react';
import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  latitude: number;
  longitude: number;
}
const Maps = ({ latitude, longitude }: MapProps) => {
  useEffect(() => {
    const { kakao } = window; // CNA에서는 useEffect 바깥에서는 window 객체를 참조할 수 없음.
    kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
      };
      const map = new kakao.maps.Map(container, options);
      const markerPosition = new kakao.maps.LatLng(latitude, longitude);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    });
  }, [latitude, longitude]);
  return <div id="map" style={{ width: '1400px', height: '400px' }}></div>;
};

export default Maps;
