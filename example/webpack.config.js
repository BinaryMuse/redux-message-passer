var config = {
  cache: true,
  entry: {
    'background': ['./src/background.js'],
    'popup': ['./src/popup.js'],
    'options': ['./src/options.js']
  },
  output: {
    path: __dirname + '/lib',
    filename: '[name]-bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/
      }
    ]
  }
}

module.exports = config
