var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");
var env = process.env.WEBPACK_ENV;
var name = require("./package.json").name;

const extractSass = new ExtractTextPlugin({
  filename: name + "/" + name + ".css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "docs"),
    filename: name + "/" + name + ".js",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader"
            }
          ],
          fallback: "style-loader"
        })
      }
    ]
  },
  plugins: [
    extractSass,
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      }
    })
  ]
};
