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
        updatelocations: './src/pages/updatelocations.js',
        updateinventoryitems: './src/pages/updateinventoryitems.js',
        updatemenuitems: './src/pages/updatemenuitems.js',
        updateorders: './src/pages/updateorders.js',
        updateusers: './src/pages/updateusers.js',
        updateschedule: './src/pages/updateschedule.js',
        removelocation: './src/pages/removelocation.js',
        removeuser: './src/pages/removeuser.js',
        removeinventoryitems: './src/pages/removeinventoryitems.js',
        removemenuitems: './src/pages/removemenuitems.js',
        removeorders: './src/pages/removeorders.js',
        backendlogin: './src/pages/login.js'
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