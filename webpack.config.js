const path = require('path');
 const HWP = require('html-webpack-plugin');
 module.exports = {
   entry: path.join(__dirname, './view/index.js'),
    output: {
       filename: 'build.js',
       path: path.join(__dirname, './dist')},
   module:{
       rules:[{
         test: /\.js$/,
           exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },

        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ]
        },

        {
          test: /\.(png|jpg(eg)?|gif|ico)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images/'
              }
            }
          ]
        }
      ]
    },
   plugins:[
        new HWP(
           {template: path.join(__dirname,'/view/index.html')}
        )
    ]
 }

 