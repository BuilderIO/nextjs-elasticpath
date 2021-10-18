const bundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: !!process.env.BUNDLE_ANALYZE,
})

module.exports = bundleAnalyzer({
  target: 'serverless',
  images: {
    domains: ['cdn.shopify.com', 'cdn.builder.io', 'via.placeholder.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              'frame-ancestors https://*.builder.io https://builder.io http://localhost:1234',
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on 'fs' module
      if (!isServer) {
          config.node = {
              "fs": "empty",
          };
      }

      return config;
  },
  env: {
    // expose env to the browser
    ELASTICPATH_CLIENT_ID: process.env.ELASTICPATH_CLIENT_ID,
    BUILDER_PUBLIC_KEY: process.env.BUILDER_PUBLIC_KEY,
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-US',
  },
})
