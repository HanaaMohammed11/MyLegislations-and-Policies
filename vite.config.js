import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // يمكنك تغيير المنفذ حسب الحاجة
    open: true, // لفتح المتصفح تلقائياً عند بدء التشغيل
  },
  build: {
    outDir: 'dist', // الدليل الناتج بعد البناء
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "./src/index.css";' 
      },
    },
  },
});
