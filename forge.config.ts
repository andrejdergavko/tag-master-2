import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { PublisherGithub } from '@electron-forge/publisher-github';

import { mainConfig } from './webpack.main.config';
import { preloadConfig } from './webpack.preload.config';
import { rendererConfig } from './webpack.renderer.config';

const NATIVE_PRINTER_PACKAGE = '@maxxuxx/node-printer';
const APP_ICON = path.resolve(__dirname, 'src/assets/rascenka-icon');

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    // Windows uses .ico, macOS .icns, Linux .png — extension is chosen by platform.
    icon: APP_ICON,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: `${APP_ICON}.ico`,
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({
      options: {
        icon: `${APP_ICON}.png`,
      },
    }),
  ],
  hooks: {
    // Webpack leaves @maxxuxx/node-printer external; install only that package
    // (and its transitive deps like safer-buffer) after prune.
    packageAfterPrune: async (_forgeConfig, buildPath) => {
      const packageJsonPath = path.join(buildPath, 'package.json');
      const originalPackageJson = await fs.promises.readFile(
        packageJsonPath,
        'utf8',
      );
      const rootPackageJson = JSON.parse(
        await fs.promises.readFile(
          path.join(process.cwd(), 'package.json'),
          'utf8',
        ),
      ) as { dependencies: Record<string, string> };

      const packageJson = JSON.parse(originalPackageJson) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      packageJson.dependencies = {
        [NATIVE_PRINTER_PACKAGE]:
          rootPackageJson.dependencies[NATIVE_PRINTER_PACKAGE],
      };
      packageJson.devDependencies = {};
      await fs.promises.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
      );

      try {
        await new Promise<void>((resolve, reject) => {
          const child = spawn(
            'npm',
            ['install', '--omit=dev', '--no-package-lock'],
            {
              cwd: buildPath,
              shell: true,
              stdio: 'inherit',
            },
          );
          child.on('error', reject);
          child.on('close', (code) => {
            if (code === 0) {
              resolve();
              return;
            }
            reject(
              new Error(
                `Failed to install ${NATIVE_PRINTER_PACKAGE} into packaged app (exit ${code})`,
              ),
            );
          });
        });
      } finally {
        await fs.promises.writeFile(packageJsonPath, originalPackageJson);
      }
    },
  },
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      // liveReload steals updates from React Fast Refresh; keep hot only.
      devServer: {
        hot: true,
        liveReload: false,
      },
      // Allow webpack HMR websocket in development (default CSP has no connect-src).
      devContentSecurityPolicy:
        "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; connect-src 'self' ws: wss: http: https:",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
              config: preloadConfig,
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'andrejdergavko',
        name: 'tag-master-2',
      },
      prerelease: false,
      draft: false, // сначала draft — проверишь, потом вручную Publish на GitHub
    }),
  ],
};

export default config;
