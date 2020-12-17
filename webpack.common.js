const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const miniCss = require("mini-css-extract-plugin");
const webpack = require("webpack");

const globals = require("./src/globals");

const ASSET_PATH = process.env.ASSET_PATH || "";

module.exports = {

  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: ASSET_PATH,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.ASSET_PATH": JSON.stringify(ASSET_PATH),
    }),
    new htmlWebpackPlugin({
      template: "src/index.ejs",
      title: "HTML webpack plugin",
      templateParameters: globals,
    }),
    new htmlWebpackPlugin({
      filename: "adm/index.html",
      template: "src/admin.ejs",
      title: "Admin page",
      templateParameters: globals,
    }),
    new miniCss({
      filename: "style.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [miniCss.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "./images/[name].[ext]",
          esModule: false,
        },
      },
      {
        test: /\.(woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "./fonts/[name].[ext]",
        },
      },
    ],
  },
};
