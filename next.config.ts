import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

import { securityHeaders } from "./src/config/security";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
