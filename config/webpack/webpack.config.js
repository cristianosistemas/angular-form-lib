'use strict';

// START_CONFIT_GENERATED_CONTENT
/** Build START */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var helpers = require('./webpackHelpers');
var basePath = process.cwd() + path.sep;

// https://webpack.github.io/docs/configuration.html#resolve-extensions
var jsExtensions = [
      '',
      '.webpack.js',
      '.web.js',
      '.js',
      '.js'
    ];
var moduleDirectories = ['node_modules', 'bower_components'];

var config = {
  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  devtool: 'source-map',
  context: path.join(basePath, 'src'),  // The baseDir for resolving the entry option and the HTML-Webpack-Plugin
  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[id].[chunkhash:8].js',  // The name for non-entry chunks
    path: 'dist/',
    pathinfo: false   // Add path info beside module numbers in source code. Do not set to 'true' in production. http://webpack.github.io/docs/configuration.html#output-pathinfo
  },
  module: {
    loaders: []
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],

  resolve: {
    // https://webpack.github.io/docs/configuration.html#resolve-modulesdirectories
    modulesDirectories: moduleDirectories,
    extensions: jsExtensions
  },

  // Output stats to provide more feedback when things go wrong:
  stats: {
    colors: true,
    modules: true,
    reasons: true
  }
};
/* **/

/** Entry point START **/
config.entry = {
  'docs': [
    './modules/docs/index.js',
    './modules/docs/styles/docs.styl',
    'angular-motion/dist/angular-motion.css',
    'highlightjs/styles/github.css'
  ],
  'ngFormLib': [
    './modules/ngFormLib/index.js'
  ],
  'sampleFormStyle': [
    './modules/docs/styles/sampleFormStyle.styl'
  ]
};

// (Re)create the config.entry.vendor entryPoint
config.entry.vendor = [
  'angular',
  'angular-animate',
  'angular-scroll',
  'angular-translate',
  'highlightjs/highlight.pack.js'
];

// Create a common chunk for the vendor modules (https://webpack.github.io/docs/list-of-plugins.html#2-explicit-vendor-chunk)
var commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: 'vendor/[name].[hash:8].js',
  minChunks: Infinity
});
config.plugins.push(commonsChunkPlugin);

/** Entry point END **/

/** JS START */

var srcLoader = {
  test: helpers.pathRegEx(/src\/.*\.(js)$/),
  loader: 'babel-loader',
  exclude: ['node_modules'],    // There should be no need to exclude unit or browser tests because they should NOT be part of the source code dependency tree
  query: {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: true,
    presets: ['es2015'],
    // Generate the "default" export when using Babel 6: http://stackoverflow.com/questions/34736771/webpack-umd-library-return-object-default
    plugins: ['add-module-exports']
  }
};
config.module.loaders.push(srcLoader);
/* **/

/** TEST UNIT START */
/* **/

/** Assets START **/
// Output module-assets to: /assets/<moduleName>/img|font/<fileName>
// Other assets (such as assets in Bootstrap) will need their own loaders
var fontLoader = {
  $$name: 'fontLoader',
  test: helpers.pathRegEx(/assets\/font\/.*\.(eot|otf|svg|ttf|woff|woff2)$/),
  loader: 'file-loader?name=/assets/[1]/font/[2].[hash:8].[ext]&regExp=' + helpers.pathRegEx('modules/(.*)/assets/font/(.+?)(.[^.]*$|$)')
};
config.module.loaders.push(fontLoader);

var imageLoader = {
  $$name: 'imageLoader',
  test: helpers.pathRegEx(/assets\/img\/.*\.(gif|ico|jpg|png|svg)$/),
  loader: 'file-loader?name=/assets/[1]/img/[2].[hash:8].[ext]&regExp=' + helpers.pathRegEx('modules/(.*)/assets/img/(.+?)(.[^.]*$|$)')
};
config.module.loaders.push(imageLoader);
/* **/

/** CSS START **/
var autoprefixer = require('autoprefixer');
config.postcss = [
  autoprefixer({
    browsers: [
      'last 1 version',
      'last 2 versions',
      'ie 9',
      'ie 10',
      'ie 11'
    ]
  })
];
var cssLoader = {
  test: helpers.pathRegEx(/\.(styl)/),
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
};
config.module.loaders.push(cssLoader);

// For any entry-point CSS file definitions, extract them as text files as well
var extractCSSTextPlugin = new ExtractTextPlugin('css/[name].[contenthash:8].css', { allChunks: true });
config.plugins.push(extractCSSTextPlugin);
/* **/

/** HTML START */
var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlLoader = {
  test: /\.html$/,
  loader: 'html-loader',
  exclude: /index-template.html$/
};
config.module.loaders.push(htmlLoader);

// Configuration that works with Angular 2  :(
config.htmlLoader = {
  minimize: true,
  removeAttributeQuotes: false,
  caseSensitive: true,
  customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
  customAttrAssign: [ /\)?\]?=/ ]
};


var indexHtmlPlugin = new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: false,      // We want full control over where we inject the CSS and JS files
  template: path.join(basePath + 'src/index-template.html')
});

config.plugins.push(indexHtmlPlugin);
/* **/

/** Server - DEV - START */
var confitConfig = require(path.join(process.cwd(), 'confit.json'))['generator-confit'];

config.devServer = {
  contentBase: config.output.path,  // We want to re-use this path
  noInfo: false,
  debug: true, // Makes no difference
  port: confitConfig.serverDev.port,
  https: confitConfig.serverDev.protocol === 'https',
  colors: true,
  // hot: true,    // Pass this from the command line as '--hot', which sets up the HotModuleReplacementPlugin automatically
  inline: true,
  // CORS settings:
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'accept, content-type, authorization',
    'Access-Control-Allow-Credentials': true
  }
};
/* **/


// To remove content hashes, call helpers.removeHash(config.prop.parent, propertyName, regExMatcher (optional));
// For example helpers.removeHash(config.output, 'fileName', /\[(contentHash|hash).*?\]/)
// END_CONFIT_GENERATED_CONTENT

extractCSSTextPlugin.filename = 'css/[name].css';

// Add additional loaders for Bootstrap assets
config.module.loaders.push({
  test: /\.(eot|otf|svg|ttf|woff|woff2)(\?.*)?$/,
  loader: 'file-loader?name=/assets/font/[name].[hash:8].[ext]'
});

config.module.loaders.push({
  test: /\.(gif|ico|jpg|png|svg)(\?.*)?$/,
  loader: 'file-loader?name=/assets/img/[name].[hash:8].[ext]'
});

// Add the CSS loader for the extra CSS files we need
config.module.loaders.push({
  test: /\.(css)/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
});

// Stop webpack from removing whitespace (which breaks the source code formatting
config.htmlLoader.collapseWhitespace = false;


module.exports = config;
