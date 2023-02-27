import Header from '@/components/Header';
import Layout from '@/components/Layout';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <RecoilRoot>
        <Layout />
        <Component {...pageProps} />
      </RecoilRoot>
    </QueryClientProvider>
  );
}
