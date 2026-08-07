import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';

/** Preload must not use React Refresh — it shares webpack HMR globals with the renderer. */
export const preloadConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  output: {
    uniqueName: 'preload',
  },
};
