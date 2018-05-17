const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

// default env vars
const env = {
  NODE_ENV: (process.env.NODE_ENV || 'development'),
  PORT: (process.env.PORT || 3000)
}

module.exports = {
  mode: 'development',
  entry: {
    popup: path.join(__dirname, 'src', 'js', 'popup.js'),
    options: path.join(__dirname, 'src', 'js', 'options.js'),
    background: path.join(__dirname, 'src', 'js', 'background.js')
  },
  devtool: 'inline-source-map',
  // devServer: {
  //   contentBase: path.join(__dirname, 'dist'),
  //   compress: true
  // },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(['dist']),

    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)}),

    // generates the manifest file using the package.json informations
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        transform: function (content, path) {
          let manifest = JSON.parse(content)
          Object.assign(manifest, {
            description: process.env.npm_package_description,
            version: process.env.npm_package_version
          })
          return Buffer.from(JSON.stringify(manifest))
        }
      },
      {
        from: 'src/img',
        to: 'img'
      }
    ]),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup']
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options.html'),
      filename: 'options.html',
      chunks: ['options']
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'background.html'),
      filename: 'background.html',
      chunks: ['background']
    }),

    new WriteFilePlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  }
}
