const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    popup: path.resolve("src/popup/popup.tsx"),
    background: path.resolve("src/background/background.tsx"),
    contentScript: path.resolve("src/contentScript/contentScript.tsx"),
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
      {
        use: ["style-loader", "css-loader"],
        test: /\.css$/i,
      },
      {
        type: "src/assets",
        test: /\.(jpg|jpeg|png|svg|woff|woff2|ttf)$/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/assets"),
          to: path.resolve("dist"),
        },
      ],
    }),
    ...getHtmlPlugins(["popup"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};

function getHtmlPlugins(sections) {
  return sections.map(
    (section) =>
      new HtmlWebpackPlugin({
        title: "TechspotDEV TimeTracker",
        filename: `${section}.html`,
        chunks: [section],
      })
  );
}
