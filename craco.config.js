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
    },
  },
}; 