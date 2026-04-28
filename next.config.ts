import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include Prisma engine binary in serverless function bundles.
  // Required because the generated client lives outside the default node_modules path.
  outputFileTracingIncludes: {
    "/api/**/*": ["./src/generated/client/**/*.node"],
  },
  async redirects() {
    return [
      { source: "/biller/ready", destination: "/biller/charges", permanent: true },
      { source: "/biller/generate", destination: "/biller/invoices", permanent: false },
    ]
  },
};

export default nextConfig;
