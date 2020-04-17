const path = require('path')

module.exports = {
    entry: {
        insertlocations: './src/pages/insertlocations.js',
        insertusers: './src/pages/insertusers.js',
        insertinventoryitems: './src/pages/insertinventoryitems.js',
        insertmenuitems: './src/pages/insertmenuitems.js',
        insertorders: './src/pages/insertorders.js',
        searchlocations: './src/pages/searchlocations.js',
        searchinventoryitems: './src/pages/searchinventoryitems.js',
        searchmenuitems: './src/pages/searchmenuitems.js',
        searchusers: './src/pages/searchusers.js',
        searchorders: './src/pages/searchorders.js',
        updatelocations: './src/pages/updatelocations.js'
    },
    mode: 'production',
    output: {
        path: path.join(__dirname, 'public/scripts'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                }
            }
        }]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public')
    }
}