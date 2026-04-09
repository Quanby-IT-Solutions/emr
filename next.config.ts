import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/biller/ready", destination: "/biller/charges", permanent: true },
      { source: "/biller/generate", destination: "/biller/invoices", permanent: false },
      { source: "/biller/reports", destination: "/biller", permanent: false },
    ]
  },
};

export default nextConfig;
