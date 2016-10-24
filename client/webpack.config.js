config = {
  entry: "./src/app.jsx",
  output: {
    filename: "bundle.js",
    path: "./build"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module:{
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['babel-plugin-transform-object-rest-spread']
        }
      }
    ]
  },
  devtool: 'source-map'
}

module.exports = config;
