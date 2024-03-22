const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

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
        use: ["style-loader", "css-loader", "less-loader"],
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
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|konva)[\\/]/,
          name: "vendors", // 拆分后的包名
          chunks: "all",
        },
      },
    },
  },
};

module.exports = config;
