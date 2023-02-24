const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin : CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

const appName = "CP_Demo";
const WATCH = process.env.NODE_ENV === "watch";
const DEVELOPMENT = process.env.NODE_ENV === "development" || WATCH;

module.exports = {
	entry: "./src/main.js",
	watch: WATCH,
	output: {
		publicPath: "",
		path: path.resolve(__dirname, "./dist/"),
		filename: "bundle.js"
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:{
					loader: "babel-loader",
					options: {
						presets: [[
							"@babel/preset-env",
							{
								"targets": {
									"safari": "11.1",
									"firefox": "50",
									"android": "50"
								}
							}
						]]
					}
				}
			},{
				test:/\.(jpe?g|png|webp|mp3|wav|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				//assets must be unzipped with pako when compressed
				//use:["base64-inline-loader", {loader: path.resolve('wp_inliner/zipLoader.js')}]
				use:["base64-inline-loader"]
				// use: [{
				// 	loader: path.resolve('wp_inliner/basedloader.js')
				// }]
			},{
				test:/\.tsx?$/,
				exclude:/node_modules/,
				use:"ts-loader"
			},{
				test:/\.(json|atlas)$/,
				type: "asset/inline",
				generator: {
					dataUrl: content => content.toString()
				}
			}
		]
	},
	plugins:
		[ // Essential plugins
			new CleanWebpackPlugin,
			new webpack.HotModuleReplacementPlugin,
			new webpack.ProvidePlugin({
				PIXI: 'pixi.js'
			})
		].concat(
			DEVELOPMENT ? [
				new HtmlWebpackPlugin({
					inject: false,
					cache: false,
					template:"template.pug",
					filename: "index.html",
					title: appName
				}),
			] : [
				new HtmlWebpackPlugin({
					inject: false,
					cache: false,
					template:"template.pug",
					filename: "IS, UN, AL/index.html",
					title: appName
				}),
				new HtmlWebpackPlugin({
					inject: false,
					cache: false,
					template:"template.pug",
					filename: "VU/ad.html",
					title: appName
				}),
				new BundleAnalyzerPlugin()
			]
		),
	// resolve: {
	// 	extensions:[".tsx",".ts",".js"]
	// },
	ignoreWarnings: [
		/spine/,
		/sourcemap/
	]
};

