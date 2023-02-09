/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //* 외부 링크(스토리지)의 이미지를 불러올때 허용
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
