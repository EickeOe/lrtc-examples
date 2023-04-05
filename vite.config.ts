import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import vitePluginImp from 'vite-plugin-imp'
import { getThemeVariables } from 'antd/dist/theme'

import packageJson from './package.json'

const theme = packageJson.theme || {}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      ...vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => `antd/es/${name}/style/index.js`
          }
        ]
      }),
      apply: 'build'
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      livhub: path.resolve(__dirname, '../livhub/src')
    }
  },
  server: {
    host: '0.0.0.0'
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          ...getThemeVariables(theme),
          ...theme
        }
      }
    }
  }
})
