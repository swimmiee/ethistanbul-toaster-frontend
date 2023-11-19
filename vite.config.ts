import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from 'vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    'process.env': process.env,
    global: {},
  },
  optimizeDeps: {
    esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
            global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
            NodeGlobalsPolyfillPlugin({
                buffer: true
            })
        ]
    }
}
})
