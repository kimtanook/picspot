/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  //* 외부 링크(스토리지, 구글)의 이미지를 불러올때 허용
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
