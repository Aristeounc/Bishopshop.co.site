const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'web/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      '@': path.resolve(__dirname, 'src'),
      'react-native-vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'web/mocks/VectorIcons.js'),
      'react-native-vector-icons': path.resolve(__dirname, 'web/mocks/VectorIcons.js'),
      '@react-native-firebase/app': path.resolve(__dirname, 'web/mocks/firebase.js'),
      '@react-native-firebase/auth': path.resolve(__dirname, 'web/mocks/firebase.js'),
      '@react-native-firebase/firestore': path.resolve(__dirname, 'web/mocks/firebase.js'),
      '@react-native-firebase/messaging': path.resolve(__dirname, 'web/mocks/firebase.js'),
      '@react-native-firebase/analytics': path.resolve(__dirname, 'web/mocks/firebase.js'),
      'react-native-iap': path.resolve(__dirname, 'web/mocks/noop.js'),
      'react-native-haptic-feedback': path.resolve(__dirname, 'web/mocks/noop.js'),
      'react-native-linear-gradient': path.resolve(__dirname, 'web/mocks/LinearGradient.js'),
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'web/mocks/asyncStorage.js'),
      'react-native-svg': path.resolve(__dirname, 'web/mocks/Svg.js'),
      'react-native-reanimated': path.resolve(__dirname, 'web/mocks/noop.js'),
      'react-native-gesture-handler': path.resolve(__dirname, 'web/mocks/noop.js'),
      'react-native-screens': path.resolve(__dirname, 'web/mocks/noop.js'),
      'react-native-safe-area-context': path.resolve(__dirname, 'web/mocks/safeArea.js'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules\/(?!(react-native-web|@react-navigation)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            plugins: ['react-native-web'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|otf|woff|woff2)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'web/index.html'),
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
};
