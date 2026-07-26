import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — there's a stray lockfile above this directory
  // that Next would otherwise infer as the root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
