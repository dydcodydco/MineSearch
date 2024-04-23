const path = require("path");
const refreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
	name: "mine-search-webpack-setting",
	mode: "development",
	devtool: "eval", // hidden-source-map
	resolve: {
		extensions: [".js", ".jsx"],
	},

	entry: {
		main: ["./client"],
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				options: {
					presets: [
						[
							"@babel/preset-env",
							{
								targets: {
									browsers: ["> 5% in KR"],
								},
							},
						],
						"@babel/preset-react",
					],
					plugins: ["react-refresh/babel"],
				},
			},
		],
	},
	plugins: [new refreshWebpackPlugin()],
	output: {
		filename: "app.js",
		path: path.join(__dirname, "dist"),
		publicPath: "/dist",
	},
	devServer: {
		devMiddleware: { publicPath: "/dist" },
		static: { directory: path.resolve(__dirname) },
		hot: true,
		liveReload: false,
	},
};
