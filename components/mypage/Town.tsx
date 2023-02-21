import { getCollection, getData, getTownData, getTownDataJeju } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { uuidv4 } from '@firebase/util';

const Town = ({ data }: any) => {
  return <>{/* <div>{data.town}</div> */}</>;
};

export default Town;
