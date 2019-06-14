const path = require("path")
const Dotenv = require('dotenv-webpack');

module.exports = env => {
  return {
    devtool: 'source-map',
    entry: path.resolve(__dirname,"./src/index.ts"),
    mode: "development",
    target: "node",
    plugins: [
      new Dotenv()
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        }
      ],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname,"./src"),
      },
      extensions: [".tsx", ".ts", ".js", ".json"],
    },
    output: {
      filename: "index.js",

      path: path.resolve(__dirname, "dist"),
      libraryTarget: 'umd',
      globalObject: 'this'
    }
  }
}
