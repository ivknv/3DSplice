const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        environment: {
            arrowFunction: false,
            bigIntLiteral: false,
            const: false,
            destructuring: false,
            dynamicImport: false,
            forOf: false,
            module: false
        }
    },
    performance: {
        maxEntrypointSize: 5000000,
        maxAssetSize: 5000000
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./src/index.html"})
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        compact: true,
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    useBuiltIns: "entry",
                                    targets: {browsers: [">0.25%, not dead"]},
                                    corejs: {
                                        version: 3,
                                        proposals: true
                                    }
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "src", "static")
        },
        compress: true,
        port: 8000,
        devMiddleware: {
            writeToDisk: false
        }
    }
};
