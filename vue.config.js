// vue.config.js
const path = require('path');

module.exports = {
  devServer: {
    port: 3000,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
        logLevel: 'debug'
      }
    },
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
      options: { usePolling: true, interval: 1000 }
    }
  },
  configureWebpack: {
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') }
    }
  },
  transpileDependencies: ['vuetify']
};
