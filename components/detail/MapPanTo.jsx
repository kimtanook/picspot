import React from 'react';
import { MapMarker, useMap } from 'react-kakao-maps-sdk';

const MapPanTo = ({ item, setIsOpen }) => {
  const map = useMap();
  return (
    <>
      <MapMarker
        key={item.id}
        position={{
          lat: item.lat,
          lng: item.long,
        }}
        onClick={() => {
          setIsOpen(item);
          let moveLatLng = new kakao.maps.LatLng(item.lat, item.long);
          map.panTo(moveLatLng);
        }}
      />
    </>
  );
};

export default MapPanTo;
