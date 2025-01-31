const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const fontRule = {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    exclude: /node_modules/,
    type: "asset/resource"
};

const jsRule = {
    test: /\.(js|jsx)$/i,
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
                ],
                "@babel/preset-react"
            ]
        }
    }
};

const rules = [
    {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
    },
    {
        test: /\.gltf$/i,
        exclude: /node_modules/,
        use: {
            loader: path.resolve(__dirname, "loaders", "gltf-loader.js")
        }
    },
    {
        test: /\.mp4$/i,
        exclude: /node_modules/,
        type: "asset/inline"
    },
    {
        test: /\.(png|jpg)$/i,
        type: "asset/resource"
    },
    {
        test: /\.html$/i,
        use: "html-loader"
    },
    fontRule,
    jsRule
];

let config = {
    entry: "./src/index.jsx",
    output: {
        filename: "js/[name].js",
        assetModuleFilename: "assets/[hash][ext][query]",
        path: path.resolve(__dirname, "dist"),
        environment: {
            arrowFunction: false,
            bigIntLiteral: false,
            const: false,
            destructuring: false,
            dynamicImport: false,
            forOf: false,
            module: false
        },
        publicPath: ""
    },
    performance: {
        maxEntrypointSize: 5000000,
        maxAssetSize: 5000000
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./src/index.html"}),
        new ESLintPlugin()
    ],
    module: {rules: rules},
    resolve: {extensions: [".js", ".jsx"]},
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

module.exports = (env, argv) => {
    if (argv.mode === "development") {
        fontRule.type = "asset/resource";

        jsRule.exclude = /node_modules/;
    } else {
        config.plugins.push(new HtmlInlineScriptPlugin());
    }
    return config;
}
