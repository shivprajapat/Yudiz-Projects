const nextTranslate = require('next-translate')
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs')
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true'
// })

const moduleExports = () => {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.includes('REACT')))
  console.log({ env })
  return {
    reactStrictMode: true,
    generateEtags: false,
    env: env,
    ...nextTranslate(),
    images: {
      domains: [
        'i.ytimg.com',
        'crictracker-admin-panel.s3.ap-south-1.amazonaws.com',
        'www.crictracker.com',
        'i9.ytimg.com',
        'crictracker-admin-panel-08032022.s3.ap-south-1.amazonaws.com',
        'crictracker-admin-panel-local-dev-08032022.s3.ap-south-1.amazonaws.com',
        'media.crictracker.com'
      ],
      deviceSizes: [450, 992, 1200, 1900],
      minimumCacheTTL: 86400,
      imageSizes: [40, 80, 120, 240]
    },
    optimization: {
      mergeDuplicateChunks: true
    },
    async rewrites() {
      return [
        {
          source: '/:slug*/feed',
          destination: '/feed'
        },
        {
          source: '/robots.txt',
          destination: '/api/robots'
        }
      ]
    },
    async redirects() {
      return [
        {
          source: '/author',
          destination: '/authors',
          permanent: true
        }
      ]
    },
    async headers() {
      return [
        {
          source: '/images/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=86400'
            }
          ]
        },
        {
          source: '/favicon.ico',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=86400'
            }
          ]
        }
      ]
    },
    trailingSlash: true,
    output: 'standalone',
    poweredByHeader: false,
    sentry: {
      // disableServerWebpackPlugin: true,
      // disableClientWebpackPlugin: true,
      // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
      // for client-side builds. (This will be the default starting in
      // `@sentry/nextjs` version 8.0.0.) See
      // https://webpack.js.org/configuration/devtool/ and
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
      // for more information.
      hideSourceMaps: true
    }
  }
}

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
// module.exports = withBundleAnalyzer(withSentryConfig(moduleExports, sentryWebpackPluginOptions))
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
