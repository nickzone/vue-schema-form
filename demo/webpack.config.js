const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TransformModulesPlugin = require('webpack-transform-modules-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, './src')
      },
      {
        test: /\.scss$/,
        loader: 'vue-style-loader!css-loader!sass-loader',
      },
      {
        test: /\.css$/,
        loader: 'vue-style-loader!css-loader',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader'
      },
    ]
  },
  resolve: {
    alias: {
      'cube-ui': 'cube-ui/lib'
    }
  },
  devServer: {
    historyApiFallback: true
  },
  performance: {
    hints: false
  },
  devtool: 'eval-source-map',
  plugins: [
    new TransformModulesPlugin(),
    new VueLoaderPlugin(),
    new htmlWebpackPlugin({
      title: 'demo',
      inject: true,
      hash: true,
      filename: 'index.html',
      template: './index.html'
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'source-map';
}