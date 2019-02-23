const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const entry = './projekt/skripte/index.js';

const output = {
  filename: 'main.js',
  path: path.resolve(__dirname, 'dist')
};

const devtool = 'source-map';

const devServer = {
  contentBase: './dist',
  port: '8000'
};

const plugins = [
  new HtmlWebPackPlugin({
    template: "./projekt/vorlagen/index.html",
    filename: "./index.html"
  }),
  new HtmlWebPackPlugin({
    template: "./projekt/vorlagen/login.html",
    filename: "./login.html"
  }),
  new HtmlWebPackPlugin({
      template: "./projekt/vorlagen/lobby.html",
      filename: "./lobby.html"
  })
];

const stylesheetsRule = {
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader'
  ]
};

const imagesRule = {
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    'file-loader'
  ]
};

const fontsRule = {
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: [
    'file-loader'
  ]
};

const htmlTemplatesRule = {
  test: /\.html$/,
  use: [
    {
      loader: "html-loader",
      options: { minimize: true }
    }
  ]
};

const svgSpriteLoaderRule = {
  test: /\.svg$/,
  use: [
    'svg-sprite-loader',
    'svgo-loader'
  ]
};

module.exports = {
  entry,

  output,

  devtool,

  devServer,

  mode: 'development',

  module: {
    rules: [
      stylesheetsRule,
      imagesRule,
      fontsRule,
      htmlTemplatesRule,
      svgSpriteLoaderRule
    ]
  },

  plugins

};
