const path = require("path")

module.exports = {
  entry: {
    pruneQuickSightUsers: "./src/pruneQuickSightUsers.ts",
  },
  target: "node14",
  devtool: "inline-source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
    clean: true,
  },
}
