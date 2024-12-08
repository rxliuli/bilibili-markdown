import { defineConfig } from 'wxt'
import path from 'path'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    manifest_version: 3,
    name: 'Bilibili Markdown',
    description:
      '为 bilibili 专栏的新版编辑器增加粘贴 markdown 的功能，将 markdown 内容导入到专栏的编辑器中',
    web_accessible_resources: [
      {
        resources: ['/inject.js'],
        matches: ['<all_urls>'],
      },
    ],
  },
  vite: () => ({
    resolve: {
      alias: {
        $lib: path.resolve('./src/lib'),
      },
      conditions: ['browser'],
    },
    build: {
      sourcemap: true,
      minify: false,
    },
  }),
  runner: {
    disabled: true,
  },
})
