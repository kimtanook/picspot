import { getUser } from '@/api';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';

function Profile() {
  const router = useRouter();
  const userId = router.query.id;
  const { data, isLoading } = useQuery('profileUser', getUser);
  const userData = data?.filter((item: any) => item.uid === userId);
  return <div>{userId}</div>;
}

export default Profile;
