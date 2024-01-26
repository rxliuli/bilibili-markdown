import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
// import devtools from 'solid-devtools/vite';
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import tailwind from 'tailwindcss'
import { firefox } from '@liuli-util/vite-plugin-firefox-dist'

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    crx({ manifest }),
    firefox({
      browser_specific_settings: {
        gecko: {
          id: 'clean-twttier@rxliuli.com',
          strict_min_version: '109.0',
        },
      },
    }) as any,
  ],
  css: {
    postcss: {
      plugins: [tailwind],
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
