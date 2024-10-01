const path = require('path')

// craco.config.js
module.exports = {
  webpack: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets/'),
      component: path.resolve(__dirname, 'src/component/'),
      view: path.resolve(__dirname, 'src/view/'),
      interface: path.resolve(__dirname, 'src/interface/'),
      constant: path.resolve(__dirname, 'src/constant/')
    }
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  }
}
