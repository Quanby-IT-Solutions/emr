import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize Prisma so Next.js doesn't try to bundle the native engine
  // and instead loads it from disk at runtime.
  serverExternalPackages: ["@prisma/client", "@prisma/engines", "prisma"],
  // Ensure all generated Prisma client files (engine binaries, schema,
  // runtime helpers) are traced into every serverless function bundle.
  // The custom output path (src/generated/client) lives outside the default
  // node_modules trace root, so we must include it explicitly.
  outputFileTracingIncludes: {
    "/**/*": [
      "./src/generated/client/**/*",
      "./prisma/schema.prisma",
    ],
  },
  async redirects() {
    return [
      { source: "/biller/ready", destination: "/biller/charges", permanent: true },
      { source: "/biller/generate", destination: "/biller/invoices", permanent: false },
    ]
  },
};

export default nextConfig;
