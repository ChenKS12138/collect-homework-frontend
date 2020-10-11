const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common");
const Dotenv = require("dotenv-webpack");
const path = require("path");

const config = merge(common, {
  mode: "development",
  target: "web",
  output: {
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: (path) =>
          !/\.module\.(le|c)ss$/.test(path) && /\.(c|le)ss$/.test(path),
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /module\.(le|c)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv({ path: path.resolve(".env.development") }),
  ],
  devServer: {
    hot: true,
    compress: true,
    // 配合页面路由history模式
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: {
          "^/api": "",
        },
        changeOrigin: true,
      },
    },
  },
  devtool: "eval-cheap-source-map",
});

module.exports = config;
