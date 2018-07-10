const path = require('path');

module.exports = {
  entry: './src/markGC.js',
  output: {
    filename: 'markGC.js',
    library: 'markGC',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  }
};

