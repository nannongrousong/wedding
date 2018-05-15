const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

//react-dev-utils webpack 4.0 bug 
//https://github.com/storybooks/storybook/pull/3148
//const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const path = require('path');
module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    //  路径简写
    resolve: {
        alias: {
            '@Config': path.resolve('config'),
            '@Component': path.resolve('client/src/js/component'),
            '@Container': path.resolve('client/src/js/container')
        }
    },
    //  热打包更新
    entry: [
        require.resolve('webpack-dev-server/client') + '?/',
        require.resolve('webpack/hot/dev-server'),
        'react-hot-loader/patch',
        path.resolve('client/src/js/index.js')
    ],
    output: {
        pathinfo: true,
        filename: 'bundle-[hash:8].js',
        publicPath: '/',
        chunkFilename: '[name]-[id].chunk-[chunkhash:8].js',
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
                            plugins: ['transform-runtime', 'transform-class-properties', ["import", { libraryName: "antd-mobile", style: "css" }]]
                        },
                    },
                    {
                        //  对依赖包的css不做module处理
                        test: /\.css$/,
                        exclude: /(client)/,
                        use: [
                            require.resolve('style-loader'),
                            require.resolve('css-loader'),
                        ]
                    },
                    {
                        //  css处理，不单独提取css
                        test: /\.css$/,
                        exclude: /(node_modules)/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    modules: true,
                                    localIdentName: '[name]__[local]',
                                }
                            }
                        ]
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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('client/src/index.html'),
            inject: true,
            favicon: path.resolve('client/src/images/favicon.ico')
        }),
        new webpack.HotModuleReplacementPlugin(),        
        //new WatchMissingNodeModulesPlugin(path.resolve('node_modules')),
    ],
    performance: {
        //  性能提示 警告
        hints: 'warning',
    },
    devServer: {
        compress: true,
        clientLogLevel: 'none',
        contentBase: path.resolve('client'),
        disableHostCheck: true,
        watchContentBase: true,
        hot: true,
        publicPath: '/',
        inline: true,
        host: '0.0.0.0',
        overlay: false,
        historyApiFallback: {
            disableDotRule: true,
        },
        stats: {
            colors: true
        },
        proxy: {
            '/': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false
            }
        }
    }
}