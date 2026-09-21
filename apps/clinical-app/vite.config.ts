import { loadLocalEnvironment } from '../api/src/runtime/local-environment.js';
// Read the local proxy setting without promoting root dotenv secrets to Vite client env.
const localEnvironment = { ...process.env };
loadLocalEnvironment(localEnvironment);
import { defineConfig } from 'vite';
export default defineConfig({
  resolve: { alias: { 'react-native': 'react-native-web' } },
  server: {
    proxy: {
      '/graphql': localEnvironment.EHR_API_TARGET ?? 'http://127.0.0.1:4000',
      '/mvp': localEnvironment.EHR_API_TARGET ?? 'http://127.0.0.1:4000',
    },
  },
});
