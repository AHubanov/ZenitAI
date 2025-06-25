const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 8080,
        proxy: {
            '/api': 'http://localhost:3000'
        },
        hot: true
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/index.html', to: 'index.html' },
                { from: 'src/styles.css', to: 'styles.css' },
                { from: 'src/ask_ai_background.png', to: 'ask_ai_background.png' },
                { from: 'src/stop_ai_background.png', to: 'stop_ai_background.png' },
                { from: 'src/background.jpg', to: 'background.jpg' }
            ],
        }),
    ]
};
