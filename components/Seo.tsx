import Head from 'next/head';

interface SeoProps {
  title: string;
}

export default function Seo({ title }: SeoProps): JSX.Element {
  return (
    <Head>
      <title>{title} | PicSpot </title>
    </Head>
  );
}
