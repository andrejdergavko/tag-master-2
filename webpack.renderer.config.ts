import type { Configuration, RuleSetRule } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactRefreshTypeScript = require('react-refresh-typescript');

export const rendererConfig = (
  _env: unknown,
  { mode }: { mode?: string },
): Configuration => {
  // Forge передаёт mode: development | production — не полагаемся на NODE_ENV
  const isDevelopment = mode === 'development';

  const rendererRules: RuleSetRule[] = rules.map((rule) => {
    if (
      rule &&
      typeof rule === 'object' &&
      'test' in rule &&
      rule.test instanceof RegExp &&
      rule.test.test('file.tsx')
    ) {
      return {
        ...rule,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: isDevelopment ? [ReactRefreshTypeScript()] : [],
            }),
          },
        },
      };
    }
    return rule as RuleSetRule;
  });

  rendererRules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  });

  rendererRules.push({
    test: /\.s[ac]ss$/i,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      { loader: 'sass-loader' },
    ],
  });

  return {
    module: {
      rules: rendererRules,
    },
    plugins: [
      ...plugins,
      isDevelopment && new ReactRefreshWebpackPlugin({ overlay: false }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.sass'],
    },
    // React Refresh injects an extra entry; without a shared runtime HMR breaks.
    optimization: isDevelopment
      ? {
          runtimeChunk: 'single',
        }
      : undefined,
    output: {
      uniqueName: 'renderer',
    },
  };
};
