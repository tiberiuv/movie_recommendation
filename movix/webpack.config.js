require('dotenv').config()
const path = require('path')
const SRC_DIR = path.join(__dirname, './src')
const DIST_DIR = path.join(__dirname, './dist')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const buildEnv = process.env.NODE_ENV || 'production'

const postCssConf = {
    sourceMap: true,
    plugins: [autoprefixer()]
}

let CONFIG = {
    production: {
        MINIFY: true,
        HOT_RELOAD: false,
        SOURCE_MAP: 'source-map',
    },
    development: {
        MINIFY: false,
        HOT_RELOAD: true,
        SOURCE_MAP: 'source-map',
    },
}

CONFIG = CONFIG[buildEnv]
console.log(CONFIG)
let minimizer = []
let splitChunks = {}
let plugins = [
    new webpack.DefinePlugin({
        __DEV__: buildEnv == 'development',
        __PROD__: buildEnv == 'production',
        'process.env': {
            NODE_ENV: JSON.stringify(buildEnv),
        }
    }),
    new HtmlWebpackPlugin({
        template: SRC_DIR + '/index.html',
        filename: 'index.html',
        buildEnv,
        inject: 'body'
    }),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
        filename: CONFIG.HOT_RELOAD ? '[name].css' : '[name].[hash].css',
        chunkFilename: CONFIG.HOT_RELOAD ? '[id].css' : '[id].[hash].css'
    }),
    new WebpackMd5Hash()
]

if (CONFIG.MINIFY) {
    minimizer = [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: true,
                ecma: 6,
                mangle: true
            },
            sourceMap: true
        })
    ]
    splitChunks = {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all'
            }
        }
    }
    plugins = [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new CleanWebpackPlugin(DIST_DIR, {}),
        new OptimizeCSSAssetsPlugin(),
    ].concat(plugins)
}

let filename = '[name].[hash].js'

if (CONFIG.HOT_RELOAD) {
    filename = '[name].js'
    plugins = [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
    ].concat(plugins)
}
module.exports = {
    target: 'web',
    entry: `${SRC_DIR}/index.js`,
    output: {
        path: DIST_DIR,
        publicPath: '/',
        filename: filename,
        chunkFilename: filename,
        sourceMapFilename: '[file].map',
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks,
        minimizer: minimizer
    },
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), 'stylus'],
        extensions: ['.js', '.jsx', '.styl'],
    },
    module: {
        rules: [{
                test: /\.styl$/,
                use: [
                    CONFIG.HOT_RELOAD ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local]--[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: postCssConf
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            'resolve url': true
                        }
                    },
                ]
            }, {
                test: /\.css/,
                use: [
                    CONFIG.HOT_RELOAD ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: postCssConf
                    }
                ],
            },
            // {
            //     test: /\.json$/,
            //     loader: 'json-loader'
            // },
            {
                test: /\.png$/,
                loader: 'url-loader?limit=100000&mimetype=image/png'
            },
            {
                test: /\.jpg/,
                loader: 'file-loader'
            },
            {
                test: /\.(js|jsx)$/,
                include: SRC_DIR,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ]
    },
    plugins: plugins,
    devtool: CONFIG.SOURCE_MAP,
    mode: buildEnv,
}