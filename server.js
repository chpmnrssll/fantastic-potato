const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config.js')
const compiler = webpack(config)
const path = require('path')
const livereload = require('easy-livereload')

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {publicPath: config.output.publicPath}))

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n')
})

// https://github.com/dai-shi/easy-livereload
let fileTypeMap = {
  jade: 'html', // `index.jade` maps to `index.html`
  styl: 'css', // `styles/site.styl` maps to `styles/site.css`
  scss: 'css', // `styles/site.scss` maps to `styles/site.css`
  sass: 'css', // `styles/site.scss` maps to `styles/site.css`
  less: 'css' // `styles/site.scss` maps to `styles/site.css`
  // add the file type being edited and what you want it to be mapped to.
}

// store the generated regex of the object keys
// let fileTypeRegex = new RegExp('\\.(' + Object.keys(fileTypeMap).join('|') + ')$')
let fileTypeRegex = new RegExp(`.(${Object.keys(fileTypeMap).join('|')})$`)

app.use(livereload({
  app: app,
  watchDirs: [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'utils')
  ],
  checkFunc: function (file) {
    return fileTypeRegex.test(file)
  },
  renameFunc: function (file) {
    // remap extention of the file path to one of the extentions in `fileTypeMap`
    return file.replace(fileTypeRegex, function (extention) {
      return '.' + fileTypeMap[extention.slice(1)]
    })
  },
  port: process.env.LIVERELOAD_PORT || 35729
}))
