import Head from 'next/head';

interface SeoProps {
  title: string;
}

export default function Seo({ title }: SeoProps): JSX.Element {
  return (
    <Head>
      <title>{title} | PicSpot </title>
      <meta property="og:title" content="Picspot" />
      <meta
        property="og:description"
        content="위치기반 사진 명소 공유 플랫폼"
      />
      <meta property="og:url" content="https://picspot.vercel.app/" />
      <meta property="og:image" content="/logo.png" />
    </Head>
  );
}
