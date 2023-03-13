import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:&display=swap"
        rel="stylesheet"
      />
      <Head />
      <body style={{ margin: '0px' }}>
        <Main />
        <NextScript />

        <Script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services,clusterer&autoload=false`}
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  );
}
