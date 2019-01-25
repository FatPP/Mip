'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.base.config.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var fs = require('fs');
var config = require('./config.json');
var path = require('path');

module.exports = merge(webpackBaseConfig, {
    output: {
        publicPath: './',
        filename: '[name].[hash].js'
    },
    plugins: [new ExtractTextPlugin({
        filename: '[name].[hash].css',
        allChunks: true
    }), new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true
        }
    }), new HtmlWebpackPlugin({
        filename: '../dist/index.html',
        template: './src/template/index.ejs',
        inject: true
    }), new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
    }])]
});