module.exports = {
  entry: './build/index.js',
  output: {
    filename: './build/bundle.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  bail: true,
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  }
}
