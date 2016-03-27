var config = {
  cache: true,
  entry: './src/index.js',
  output: {
    path: __dirname + '/lib',
    filename: 'index.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  }
}

module.exports = config
