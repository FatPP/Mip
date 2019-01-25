const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require('fs');
const config = require('./config.json')
var path = require('path')

// fs.open('./src/config/env.js', 'w', function (err, fd) {
//     const buf = 'export default "development";';
//     fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) { });
// });

module.exports = merge(webpackBaseConfig, {
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        disableHostCheck: true,
        proxy: {
            '/mams-rest/*': {
                // 通用开发平台测试环境
                target: 'http://10.241.97.60:8081',
                // target: 'http://10.241.34.46:8081',
                secure: false,
                changeOrigin: true 
            },
            '/biz-m-rest/*': {
                // 信托数据上报平台测试环境
                target: 'http://10.241.97.60:8081',
                secure: false,
                changeOrigin: true
            }
        }

    },
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        // publicPath: 'http://10.241.97.60:8081/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                API: JSON.stringify(config['development'])
            }
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: 'static',
            ignore: ['.*']
        }])
    ]
});