import CommentList from '@/components/detail/CommentList';
import Seo from '@/components/Seo';
import { useRouter } from 'next/router';

export default function Detail() {
  const route = useRouter();
  const id = route.query.id;

  return (
    <div>
      <Seo title="Detail" />
      <div>{route.query.id}</div>
      <CommentList postId={id} />
    </div>
  );
}
