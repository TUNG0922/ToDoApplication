const path = require('path')

module.exports = {
  devServer: {
    port: 3000, // frontend runs on http://localhost:3000
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // '@' now points to ./src
      },
    },
  },
}
