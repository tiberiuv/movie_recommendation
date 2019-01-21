require('dotenv').config()
const path = require('path')
const SRC_DIR = path.join(__dirname, './src')
const DIST_DIR = path.join(__dirname, './public')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const buildEnv = process.env.NODE_ENV || 'production'

let CONFIG = {
    production: {
        MINIFY: true,
        HOT_RELOAD: false,
        SOURCE_MAP: 'sourcemap',
    },
    development: {
        MINIFY: false,
        HOT_RELOAD: true,
        SOURCE_MAP: 'eval',
    },
}

CONFIG = CONFIG[buildEnv]
let minimizer = []
let plugins = [
    new CleanWebpackPlugin('dist', {} ),
    new webpack.DefinePlugin({
        __DEV__: buildEnv == 'development',
        __PROD__: buildEnv == 'production',
        'process.env': {
            NODE_ENV: JSON.stringify(buildEnv),
        }
    }),
    new HtmlWebpackPlugin({
        template: SRC_DIR +'/index.html',
        filename: 'index.html',
        buildEnv,
        inject: 'body'
    }),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
    }),
    new WebpackMd5Hash()
]

if (CONFIG.MINIFY) {
    minimizer = [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: false,
                ecma: 6,
                mangle: true
            },
            sourceMap: true
        })
    ]
    plugins = [
        new webpack.LoaderOptionsPlugin({minimize: true, debug: false}),
    ].concat(plugins)
}

if (CONFIG.HOT_RELOAD) {
    
    plugins = [new webpack.NoEmitOnErrorsPlugin(), new webpack.NamedModulesPlugin()].concat(plugins)
}
module.exports = {
    entry: `${SRC_DIR}/index.js`,
    output: {
        path: DIST_DIR,
        publicPath: '/',
        filename: 'bundle.js',
    },
    optimization: {
        minimizer: minimizer
    },
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), 'stylus'],
        extensions: ['.js', '.jsx', '.styl'],
    },
    target: 'web',
    module : {
        rules : [
            {
                test: /\.styl$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {loader: 'css-loader'},
                    {loader: 'stylus-loader'},
                ]
            },
            {
                test: /\.css/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
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
                include : SRC_DIR,
                exclude: /node_modules/,
                loader : 'babel-loader',
            },
        ]
    },
    plugins: plugins,
    devtool: CONFIG.SOURCE_MAP,
}