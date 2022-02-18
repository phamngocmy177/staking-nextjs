const withPlugins = require("next-compose-plugins");
// const withImages = require("next-images");
// const withSass = require("@zeit/next-sass");
// const withCSS = require("@zeit/next-css");
const path = require("path");

module.exports = withPlugins([], {
  webpack(config, options) {
    config.resolve.modules.push(path.resolve("./"));
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: "https://api.coingecko.com/api/v3/coins/:path*", // Proxy to Backend
      },
      {
        source: "/images/:path*",
        destination: "https://ethplorer.io/images/:path*", // Proxy to Backend
      },
    ];
  },

  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  images: {
    domains: [],
  },
});
