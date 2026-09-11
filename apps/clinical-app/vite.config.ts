import { defineConfig } from 'vite';
export default defineConfig({
  resolve: { alias: { 'react-native': 'react-native-web' } },
  server: { proxy: { '/graphql': process.env.EHR_API_TARGET ?? 'http://127.0.0.1:4000', '/mvp': process.env.EHR_API_TARGET ?? 'http://127.0.0.1:4000' } },
});
