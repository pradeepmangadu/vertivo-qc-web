import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

// In production builds, inject a strict Content-Security-Policy <meta>.
// (Also set it as an HTTP header at your host — see public/_headers — and add frame-ancestors there.)
function csp(apiUrl: string): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      const policy = [
        "default-src 'self'", "script-src 'self'", "style-src 'self'",
        "img-src 'self' blob: data: https://*.supabase.co",
        `connect-src 'self' ${apiUrl}`,
        "object-src 'none'", "base-uri 'self'", "form-action 'self'",
      ].join('; ');
      return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: mode === 'github-pages' ? '/vertivo-qc-web/' : '/',
    plugins: [react(), csp(env.VITE_API_URL || 'http://localhost:4000')],
    build: { sourcemap: false },
    server: { port: 5173 },
  };
});
