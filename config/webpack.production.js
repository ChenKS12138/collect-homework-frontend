const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const ManifestPlugin = require("webpack-manifest-plugin");

const config = merge(common, {
  mode: "production",
  output: {
    filename: "js/[name]_[hash].js",
    path: path.resolve("./dist"),
    publicPath: "/",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name]_[hash].css",
      chunkFilename: "css/[id]_[hash].css",
    }),
    new Dotenv({ path: path.resolve(".env.production") }),
    new ManifestPlugin(),
  ],
});
module.exports = config;
