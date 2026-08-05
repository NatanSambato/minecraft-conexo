const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minecraft.wiki",
      },
      {
        protocol: "https",
        hostname: "pt.minecraft.wiki",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
      },
    ],
  },
};

export default nextConfig;
