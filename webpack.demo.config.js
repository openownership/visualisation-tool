const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './demo/index.js',
    'bods-dagre': './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'demo-build'),
    library: 'BODSDagre',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
    new HtmlWebpackPlugin({
      inject: true,
      template: './demo/index.html',
      excludeChunks: ['bods-dagre'],
    }),
    new TerserPlugin({
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      parallel: true,
      terserOptions: {
        // Enable file caching
        nameCache: {},
        sourceMap: true,
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/images', to: 'images' },
        { from: 'node_modules/flag-icons/flags/4x3/', to: 'images/flags/' },
        { from: 'demo/script-tag.html', to: 'script-tag.html' },
        { from: 'demo/demo.css', to: 'demo.css' },
        { from: 'demo/script-tag.js', to: 'demo.js' },
      ],
    }),
  ],
};
