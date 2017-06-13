var path = require('path');

module.exports = {
    entry: __dirname + '/Scripts/entry.jsx',
    output: {
       publicPath: "/js/",
       path: path.join(__dirname, '/wwwroot/js/'),
       filename: 'bundle.js'
    },
    watch: true,    
    module: {
        rules: [
            {
                test: /\.js$/,                
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test : /\.jsx$/,
                include : __dirname,
                loader : 'babel-loader'
            },
            {
                test : /\.jsx$/,
                include : path.join(__dirname, '/wwwroot/js/Components'),
                loader : 'babel-loader'
            },            
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }
            }
        ]
    }
};