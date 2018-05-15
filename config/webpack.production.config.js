const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
//  分离css
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');

//  保证自定义样式覆盖依赖库（如antd-mobile）旧样式
const commonExtractCss = new ExtractTextPlugin('./static/common-[hash:8].css')
const styleExtractCss = new ExtractTextPlugin('./static/style-[hash:8].css')

module.exports = {
    mode: 'production',
    //  打包出现错误直接退出
    bail: true,
    devtool: 'none',
    //  路径简写
    resolve: {
        alias: {
            '@Config': path.resolve('config'),
            '@Component': path.resolve('client/src/js/component'),
            '@Container': path.resolve('client/src/js/container')
        }
    },
    entry: path.resolve('client/src/js/index.js'),
    output: {
        path: path.resolve('client/dist'),
        filename: './bundle-[hash:8].js',
        publicPath: './',
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        //  图片base64
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 8192,
                            name: 'static/[name].[ext]',
                        }
                    },
                    {
                        // js es6,jsx react
                        test: /\.(js|jsx|mjs)$/,
                        include: path.resolve('client'),
                        loader: require.resolve('babel-loader'),
                        options: {
                            cacheDirectory: true,
                            presets: [
                                'env', 'react'
                            ],
                            //  antd按模块加载
                            plugins: ['transform-runtime', 'transform-class-properties',
                                ["import", { libraryName: "antd-mobile", style: "css" }]]
                        },
                    },
                    {
                        //  对依赖包的css不做module处理
                        test: /\.css$/,
                        exclude: /(client)/,
                        loader: commonExtractCss.extract({
                            fallback: require.resolve('style-loader'),
                            use: {
                                loader: require.resolve('css-loader')
                            }
                        })
                    },
                    {
                        //  css处理，单独提取css
                        test: /\.css$/,
                        exclude: /(node_modules)/,
                        loader: styleExtractCss.extract({
                            fallback: require.resolve('style-loader'),
                            use: {
                                loader: require.resolve('css-loader'),
                                options: {
                                    modules: true,
                                    localIdentName: '[name]__[local]',
                                    minimize: true
                                }
                            }
                        })
                    },
                    {
                        //  直接搬运处理不了的文件
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/[name].[ext]',
                        },
                    }
                ]
            }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve('client/src/index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeStyleLinkTypeAttributes: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            favicon: path.resolve('client/src/images/favicon.ico')
        }),
        commonExtractCss,
        styleExtractCss,
        new BundleAnalyzerPlugin()
    ],
    performance: {
        //  性能提示 错误，后期再改error吧...
        hints: 'warning',
    },
    optimization: {
        minimizer: [
          new UglifyJSPlugin({
            uglifyOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true
              }
            }
          })
        ]
      }
}