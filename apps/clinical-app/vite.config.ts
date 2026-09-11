import { defineConfig } from 'vite';
export default defineConfig({
  resolve: { alias: { 'react-native': 'react-native-web' } },
  server: { proxy: { '/graphql': 'http://127.0.0.1:4000', '/mvp': 'http://127.0.0.1:4000' } },
});
