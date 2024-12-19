import { defineProject, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';
import { storybookNextJsPlugin } from '@storybook/experimental-nextjs-vite/vite-plugin';
import libConfig from './libs/webb-ui-components/vite.config';

export default [
  '**/*/vite.config.ts',
  '**/*/vitest.config.ts',
  mergeConfig(
    libConfig,
    defineProject({
      plugins: [
        storybookTest({
          configDir: './libs/webb-ui-components/.storybook',
          storybookScript: 'yarn storybook --ci',
        }),
        storybookNextJsPlugin(),
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          name: 'chromium',
          provider: 'playwright',
          headless: true,
        },
        setupFiles: ['.storybook/vitest.setup.ts'],
      },
    }),
  ),
];
