const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./src/index.html"})
    ],
    module: {
        rules: [
            {
                test: /\.glb$/i,
                type: "asset/resource"
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "static")
        },
        compress: true,
        port: 8000
    }
};
