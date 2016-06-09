var webpack = require('webpack')
var path = require('path')

module.exports = {

  devtool: 'eval-source-map',

  entry: {

    bundle: [
      'webpack-hot-middleware/client',
      './src/client/index.js'
    ]
  },

  output: {
    path: path.join(__dirname, '../dist'),
    filename: "[name].js",
    publicPath: './'
  },

  plugins: [

    new webpack.optimize.UglifyJsPlugin({minimize: false}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    new webpack.ProvidePlugin({
      _ : "underscore",
      jQuery: "jquery",
      $: "jquery"
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: [
      path.resolve('./src/client'),
      path.resolve('./src/client/utils'),
      path.resolve('./src/client/Components'),
      path.resolve('./src/client/Components/Viewer/extensions')
    ]
  },

  module: {

    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  }
}
