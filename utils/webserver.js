let WebpackDevServer = require('webpack-dev-server')
let webpack = require('webpack')
let config = require('../webpack.config')
let env = require('./env')
let path = require('path')

let options = (config.chromeExtensionBoilerplate || {})
let excludeEntriesToHotReload = (options.notHotReload || [])

for (let entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      // ('webpack-dev-server/client?http://localhost:' + env.PORT),
      `webpack-dev-server/client?http://localhost:${env.PORT}`,
      'webpack/hot/dev-server'
    ].concat(config.entry[entryName])
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || [])

delete config.chromeExtensionBoilerplate

var compiler = webpack(config)

var server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.join(__dirname, '../build'),
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})

server.listen(env.PORT)
