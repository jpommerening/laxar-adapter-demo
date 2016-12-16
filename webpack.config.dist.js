const path = require( 'path' );
const webpack = require( 'webpack' );

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
      } )
   ]
} );
