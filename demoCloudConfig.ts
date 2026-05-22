export interface DemoCloudConfig {
  credentials: {
    apiUserName: string;
    apiKey: string;
  };
  localLink: string;
  connectMediaSFU: boolean;
}

// Publish-safe defaults. Use scripts/configure-mediasfu-defaults.mjs
// to temporarily swap in staging or other local test values when needed.
export const DEMO_MEDIASFU_API_USERNAME = 'your-api-username';
export const DEMO_MEDIASFU_API_KEY = 'your-api-key';
export const DEMO_CONNECT_MEDIA_SFU = false;

export const getDemoCloudConfig = (): DemoCloudConfig => ({
  credentials: {
    apiUserName: DEMO_MEDIASFU_API_USERNAME,
    apiKey: DEMO_MEDIASFU_API_KEY,
  },
  localLink: '',
  connectMediaSFU: DEMO_CONNECT_MEDIA_SFU,
});