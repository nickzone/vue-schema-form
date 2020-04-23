const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const nodeExternals = require('webpack-node-externals');
const { NODE_ENV } = process.env;

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    library: 'vForm',
    libraryTarget: 'umd'
  },
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        loader: 'vue-style-loader!css-loader!postcss-loader!sass-loader',
      },
      {
        test: /\.css$/,
        loader: 'vue-style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader!eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader'
      },
    ]
  },
  externals: [
    nodeExternals()
  ],
  performance: {
    hints: 'warning'
  },
  devtool: 'source-map',
  plugins: [
    new VueLoaderPlugin()
  ]
};