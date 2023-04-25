const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

const fontRule = {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    exclude: /node_modules/,
    type: "asset/inline"
};

const jsRule = {
    test: /\.js$/i,
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
        type: "asset/inline"
    },
    {
        test: /\.html$/i,
        use: "html-loader"
    },
    fontRule,
    jsRule
];

let config = {
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
        },
        publicPath: ""
    },
    performance: {
        maxEntrypointSize: 5000000,
        maxAssetSize: 5000000
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./src/index.html"})
    ],
    module: {rules: rules},
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
        rules.splice(rules.findIndex(x => { return x === jsRule; }), 1);
    } else {
        config.plugins.push(new HtmlInlineScriptPlugin());
    }
    return config;
}
