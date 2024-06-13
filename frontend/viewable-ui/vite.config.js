import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    process.env.BUILD_ENV === 'ghpages' ? {
      name: 'inject-ghpages-fix',
      transformIndexHtml(html) {
        return html.replace(
          '<div id="root"></div>',
          '<div id="root"></div><script type="text/javascript">(function(l) {if (l.search[1] === "/" ) {var decoded = l.search.slice(1).split("&").map(function(s) {return s.replace(/~and~/g, "&")}).join("?");window.history.replaceState(null, null,l.pathname.slice(0, -1) + decoded + l.hash);}}(window.location))</script>'
        );
      }
    } : ''
  ],
  server: {},
  build: {
    outDir: 'dist/' + process.env.BUILD_ENV
  }
})