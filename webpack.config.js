const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        content: './content.js',
        background: './background.js',
        popup: './popup.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '\\build'
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
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader',
            ],
        }
      ]
    },
    resolve: {
        alias: {
           handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    plugins: [
        new UglifyJsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'app.css',
            path: __dirname + '\\build'
        })
    ]
  };