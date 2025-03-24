module.exports = {
  style: {
    postcss: {
      plugins: [
        require('@tailwindcss/postcss'),
      ],
    },
  },
  webpack: {
    configure: {
      optimization: {
        minimize: process.env.NODE_ENV === 'production',
      },
      resolve: {
        fallback: {
          // Add polyfills for Node.js core modules used by Twilio
          "url": require.resolve("url/"),
          "querystring": require.resolve("querystring-es3"),
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "buffer": require.resolve("buffer/"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "assert": require.resolve("assert/"),
          "path": require.resolve("path-browserify"),
          "util": require.resolve("util/"),
          "zlib": require.resolve("browserify-zlib")
        }
      }
    },
  },
}; 