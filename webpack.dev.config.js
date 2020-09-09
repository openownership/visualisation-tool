const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './demo/index.js',
  watch: true,
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dev-build'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dev-build'),
    compress: true,
    port: 9000,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ inject: true, template: './demo/index.html' }),
    new TerserPlugin({
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      parallel: true,
      // Enable file caching
      cache: true,
      sourceMap: true,
    }),
  ],
};
