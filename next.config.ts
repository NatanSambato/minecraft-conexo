const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minecraft.wiki',
      },
      {
        protocol: 'https',
        hostname: 'pt.minecraft.wiki'
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com'
      },
    ],
  },
};

export default nextConfig;
