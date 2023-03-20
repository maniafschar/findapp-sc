const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/js/main.js',
	mode: 'production',
	output: {
		globalObject: 'this',
		filename: 'js/main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		minimize: true
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-transform-runtime']
					}
				}
			}
		]
	},
	experiments: {
		topLevelAwait: true
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		{
			apply: compiler => {
				compiler.hooks.afterEmit.tap('client', () => {
					var fs = require('fs');
					fs.mkdirSync('dist/images');
					var logo = fs.readFileSync('../web/src/images/logo.svg', 'utf8');
					fs.writeFileSync('dist/images/logoOrg.svg', logo.replace('viewBox="0 0 1000 400"', 'viewBox="0 0 900 400"').replace('<g>', '<g class="org">'));
					fs.writeFileSync('dist/images/logoStore.svg', logo.replace('viewBox="0 0 1000 400"', 'viewBox="0 0 900 400"').replace('<g>', '<g class="small">').replace(' class="position"></text>', ' class="position">München</text>'));
					fs.writeFileSync('dist/images/logoSmall.svg', logo.replace('viewBox="0 0 1000 400"', 'viewBox="0 0 400 400"').replace('<g>', '<g class="small">'));
					fs.writeFileSync('dist/images/logoIcon.svg', logo.replace('viewBox="0 0 1000 400"', 'viewBox="0 0 400 400"').replace('<g>', '<g class="icon">'));
				})
			}
		}
	]
}