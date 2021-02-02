const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'three-dxf.js',
        path: path.resolve(__dirname, 'lib'),
        library: 'ThreeDxf',
        libraryTarget: 'umd',
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: 'babel-loader',
        }],
    },
    externals: {
        three: 'THREE'
    },
};