const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const RENDERERS = [
  {
    name: "index",
    dir: path.resolve(__dirname, "./index"),
  },
  {
    name: "screenshot",
    dir: path.resolve(__dirname, "./screenshot"),
  },
];

/**
 * @type webpack.Configuration
 */
const config = {
  mode: process.env.NODE_ENV,
  entry: RENDERERS.reduce((acc, cur) => {
    acc[cur.name] = cur.dir + "/src/index.tsx";
    return acc;
  }, {}),
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
      ...RENDERERS.map((render) => ({
        test: /\.[tj]sx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: render.dir + "/tsconfig.json",
          },
        },
        include: render.dir,
      })),
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    ...RENDERERS.map(
      (render) =>
        new HTMLWebpackPlugin({
          template: path.resolve(__dirname, "./index.html"),
          filename: render.name + "/index.html",
          chunks: [render.name],
        })
    ),
    new MiniCssExtractPlugin({
      filename: "[name]/[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-reconciler)[\\/]/,
          name: "react",
          chunks: "all",
        },
        konva: {
          test: /[\\/]node_modules[\\/](konva|react-konva)[\\/]/,
          name: "konva",
          chunks: (chunk) => {
            return chunk.name === "screenshot";
          },
        },
      },
    },
  },
};

module.exports = config;
