import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests/mvp-web',workers:1,timeout:45000,use:{baseURL:'http://127.0.0.1:5174',headless:true,viewport:{width:1440,height:1000},screenshot:'only-on-failure'},outputDir:'test-results/mvp'});
