import Header from '@/components/Header';
import Layout from '@/components/Layout';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import GlobalStyle from './global';
import { ThemeProvider } from 'styled-components';
import { useEffect } from 'react';
import { init } from '@amplitude/analytics-browser';
// import { ReactQueryDevtools } from 'react-query/devtools';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const theme = {
  // mobile: `(max-width: 425px)`,
  mobile: `(max-width: 820px)`,
};

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    init('e579522099b0ce6296a946a184165cf3');
  }, []);

  return (
    <QueryClientProvider client={client}>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Layout />
          <Component {...pageProps} />
        </ThemeProvider>
      </RecoilRoot>
      {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
    </QueryClientProvider>
  );
}
