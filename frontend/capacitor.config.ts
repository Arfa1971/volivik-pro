import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.volivik.quotation',
  appName: 'BIC-Quotation-App',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'https'
  },
  loggingBehavior: 'debug'
};

export default config;
