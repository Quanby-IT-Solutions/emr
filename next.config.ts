import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Prisma's generated client engine binaries (in src/generated/client)
  // are bundled into every serverless function on Vercel.
  outputFileTracingIncludes: {
    "**/*": ["./src/generated/client/**/*"],
  },
  serverExternalPackages: ["@prisma/client", "@prisma/engines"],
  async redirects() {
    return [
      { source: "/biller/ready", destination: "/biller/charges", permanent: true },
      { source: "/biller/generate", destination: "/biller/invoices", permanent: false },
    ]
  },
};

export default nextConfig;
