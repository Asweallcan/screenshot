const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

/**
 * @type webpack.Configuration
 */
const config = {
  mode: process.env.NODE_ENV,
  entry: {
    index: path.resolve(__dirname, "./index/src/index.tsx"),
    screenshot: path.resolve(__dirname, "./screenshot/src/index.tsx"),
  },
  output: {
    path: path.resolve(__dirname, "../dist/renderers"),
    clean: true,
    filename: "[name]/index.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "./screenshot/tsconfig.json"),
          },
        },
        include: path.resolve(__dirname, "./screenshot"),
      },
      {
        test: /\.[tj]sx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "./index/tsconfig.json"),
          },
        },
        include: path.resolve(__dirname, "./index"),
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      filename: "screenshot/index.html",
      chunks: ["screenshot"],
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      filename: "index/index.html",
      chunks: ["index"],
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "vendors", // 拆分后的包名
          chunks: "all",
        },
      },
    },
  },
};

module.exports = config;
