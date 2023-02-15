import Seo from '@/components/Seo';
import { Map } from 'react-kakao-maps-sdk';
import { addData, getDatas, postCounter, updataData } from '@/api';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import DetailNoMap from '@/components/detail/DetailNoMap';

export default function detail() {
  return (
    <div>
      <Seo title="Detail" />
      <div>
        <Map
          center={{
            lat: 33.450701,
            lng: 126.570667,
          }}
          style={{
            width: '100%',
            height: '450px',
          }}
          level={6}
        />
      </div>
      <DetailNoMap />
    </div>
  );
}
