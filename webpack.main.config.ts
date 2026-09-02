import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  // Keep as a real package so winspool prebuilds resolve at runtime.
  externals: {
    '@maxxuxx/node-printer': 'commonjs2 @maxxuxx/node-printer',
    'xlsx/xlsx.js': 'commonjs2 xlsx',
  },
};
