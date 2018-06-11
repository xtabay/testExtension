const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "style-loader"
                },
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: "[name]",
                        sourceMap: true,
                        minimize: true
                    }
                },
                {
                    loader: "sass-loader"
                },
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
        new UglifyJsPlugin()
    ]
  };