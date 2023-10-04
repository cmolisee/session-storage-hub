/* eslint-disable no-undef */
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
	webpack: {
		plugins: [
			new webpack.DefinePlugin({
				'process.env.VERSION': JSON.stringify(fs.readFileSync('./VERSION', 'utf-8')),
			}),
		],
		configure: (webpackConfig, { env, paths }) => {
			return {
				...webpackConfig,
				entry: {
					main: [
						env === 'development' &&
							require.resolve(
								'react-dev-utils/webpackHotDevClient'
							),
						paths.appIndexJs,
					].filter(Boolean),
					content: paths.appSrc + '/chromeServices/content.ts',
					background: paths.appSrc + '/chromeServices/background.ts',
				},
				output: {
					...webpackConfig.output,
					filename: 'static/js/[name].js',
				},
				optimization: {
					...webpackConfig.optimization,
					runtimeChunk: false,
				},
			};
		},
	},
};
