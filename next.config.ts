import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained production artifact (.next/standalone/server.js) for VPS deploy.
  output: "standalone",

  // three.js / r3f / drei ship untranspiled ESM add-ons; transpile them to avoid build/HMR breakage.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Tell nginx not to buffer streamed RSC / Suspense responses (per Next.js self-hosting docs).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Accel-Buffering", value: "no" }],
      },
    ];
  },
};

export default nextConfig;
