const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const HappyPack = require("happypack");
const webpack = require("webpack");

const config = merge({
  target: "web",
  entry: {
    index: path.resolve("./src/index.tsx"),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "chunk_vendor",
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "happypack/loader",
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets",
              publicPath: "/assets",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx"],
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "@": path.resolve("./src"),
      mock: path.resolve("./mock"),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.MOCK_REQUEST": process.env.MOCK_REQUEST,
    }),
    new HappyPack({
      loaders: ["babel-loader?cacheDirectory=true"],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve("./public/index.html"),
      filename: "index.html",
      meta: {
        viewport: "width=device-width, initial-scale=1.0",
      },
      title: "作业提交平台",
      chunks: ["index", "chunk_vendor"],
      minify: {
        collapseWhitespace: true,
      },
      favicon: path.resolve("./public/favicon.png"),
    }),
  ],
});

module.exports = config;
