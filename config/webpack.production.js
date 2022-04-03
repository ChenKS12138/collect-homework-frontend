const merge = require("webpack-merge");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const ManifestPlugin = require("webpack-manifest-plugin");
const RobotstxtPlugin = require("robotstxt-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const process = require("process");

const gitRevisionPlugin = process.env["GIT_COMMIT_HASH"]
  ? undefined
  : new (require("git-revision-webpack-plugin"))();

const plugins = [];
gitRevisionPlugin && plugins.push(gitRevisionPlugin);

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
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 1,
        },
        antd: {
          test: /[\\/]node_modules[\\/](antd|rc\-|@ant-design)/,
          priority: 2,
        },
      },
    },
    minimize: true,
  },
  module: {
    rules: [
      {
        test: (path) =>
          !/\.module\.(le|c)ss$/.test(path) && /\.(c|le)ss$/.test(path),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /module\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
    ],
  },

  plugins: [
    ...plugins,
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(
        process.env["GIT_COMMIT_HASH"] ||
          (gitRevisionPlugin && gitRevisionPlugin.commithash())
      ),
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name]_[hash].css",
      chunkFilename: "css/[id]_[hash].css",
    }),
    // new Dotenv({ path: path.resolve(".env.production") }),
    new ManifestPlugin(),
    new RobotstxtPlugin({
      host: "https://homework.cattchen.top",
      policy: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/api", "/assets", "/js", "/css"],
          crawlDelay: 10,
        },
      ],
    }),
  ],
  stats: {
    children: false,
  },
  // externals: {
  //   react: "React",
  //   axios: "axios",
  //   "react-dom": "ReactDOM",
  // },
});

if (process.env.BUNDLE_ANALYZE) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
