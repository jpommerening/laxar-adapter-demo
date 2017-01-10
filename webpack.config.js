const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
   entry: {
      main: [ './index.js' ],
      vendor: [ 'laxar/polyfills', 'laxar' ]
   },

   output: {
      path: path.resolve( './dist/' ),
      publicPath: 'dist/',
      filename: '[name].js'
   },

   plugins: [
      new webpack.optimize.CommonsChunkPlugin( {
         name: 'vendor',
         chunks: [ 'vendor' ],
         children: true
      } ),
      new webpack.SourceMapDevToolPlugin( {
         filename: '[name].js.map'
      } )
   ],

   resolve: {
      root: [
         path.resolve( './node_modules' ),
         path.resolve( './vendor' )
      ],
      extensions: [ '', '.js', '.jsx', '.ts', '.tsx', '.vue', '.elm' ],
      alias: {
         'laxar-types': 'laxar-angular2-adapter/types.ts'
      }
   },

   module: {
      loaders: [
         {
            test: /.spec.(jsx?|tsx?)$/,
            loader: './vendor/laxar-mocks/spec-loader'
         },
         {  // load JavaScript (and JSX) with babel
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
         },
         {  // load TypeScript (and TSX) with the TypeScript loader
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
         },
         {  // load Vue components with the Vue loader
            test: /\.vue$/,
            loader: 'vue-loader',
            exclude: /node_modules/
         },
         {  // load Elm programs with the Elm loader
            test: /\.elm$/,
            loader: 'elm-hot-loader!elm-webpack-loader?verbose&warn',
            exclude: /node_modules/
         },
         {  // load images and fonts with the file-loader
            // (out-of-bundle in dist/assets/)
            test: /\.(gif|jpe?g|png|ttf|woff2?|svg|eot|otf)(\?.*)?$/,
            loader: 'file-loader'
         },
         {  // ... after optimizing graphics with the image-loader
            test: /\.(gif|jpe?g|png|svg)$/,
            loader: 'img-loader?progressive=true'
         },
         {  // resolve CSS url()s and dependencies with the css loader
            test: /\.css$/,
            loader: 'style-loader!css-loader'
         }
      ]
   },
   fileLoader: {
      name: 'assets/[name]-[sha1:hash:hex:6].[ext]'
   }
};
