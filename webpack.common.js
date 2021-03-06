const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'three-dxf.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'ThreeDxf',
        libraryTarget: 'umd'
        // globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: 'babel-loader',
        }],
    },
    devServer: {
        static: [
            path.join(__dirname, 'sample'),
            path.join(__dirname, "node_modules")
        ],
        port: 9000,
        host: 'localhost'
    },
    externals: {
        three: 'THREE'
    },
    resolve: {
        fallback: {
            "os": false
        }
    }
};