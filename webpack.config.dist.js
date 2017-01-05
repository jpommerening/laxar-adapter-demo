const path = require( 'path' );
const webpack = require( 'webpack' );

webpack.ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const baseConfig = require( './webpack.config.js' );

module.exports = Object.assign( {}, baseConfig, {
   output: {
      path: path.resolve( './dist/' ),
      publicPath: 'dist/',
      filename: '[name].min.js'
   },
   plugins: [
      // make react happy
      new webpack.DefinePlugin( {
         'process.env': { 'NODE_ENV': JSON.stringify( 'production' ) }
      } ),
      new webpack.optimize.DedupePlugin(),
      new webpack.SourceMapDevToolPlugin( { filename: '[name].min.js.map' } ),
      new webpack.optimize.UglifyJsPlugin( {
         compress: { warnings: false },
         sourceMap: true
      } ),
      new webpack.ExtractTextPlugin( '[name].css' )
   ],
   module: {
      loaders: baseConfig.module.loaders.map( function( config ) {
         const test = config.test;
         const loader = config.loader;
         if( loader === 'style-loader!css-loader' ) {
            return {
               test,
               loader: webpack.ExtractTextPlugin.extract( 'css-loader' )
            };
         }
         return {
            test,
            loader
         };
      } )
   }
} );
