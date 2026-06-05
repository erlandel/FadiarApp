import type { NextConfig } from "next";
import os from "os";

// function getLocalIPs(): string[] {
//   const interfaces = os.networkInterfaces();
//   const ips: string[] = [];
//   for (const iface of Object.values(interfaces)) {
//     for (const config of iface ?? []) {
//       if (config.family === "IPv4" && !config.internal) {
//         ips.push(config.address);
//       }
//     }
//   }
//   return ips;
// }

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.fadiar.com",
        port: "444",
        pathname: "/prueba/api/_images/**",
      },
    ],
  },
  // allowedDevOrigins: getLocalIPs(),
};

export default nextConfig;