import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hgefxodfiyjhfnqmobfg.supabase.co",
        pathname: "/storage/v1/object/public/memes/**",
      },
    ],
  },
};

export default nextConfig;
