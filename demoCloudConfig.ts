export interface DemoCloudConfig {
  credentials: {
    apiUserName: string;
    apiKey: string;
  };
  localLink: string;
  connectMediaSFU: boolean;
}

// Non-production placeholders for the included demo app. Replace them with
// your own MediaSFU Cloud credentials or self-hosted configuration before connecting.
export const DEMO_MEDIASFU_API_USERNAME = 'yourAPIUSERNAME';
export const DEMO_MEDIASFU_API_KEY = 'yourAPIKEY';
export const DEMO_CONNECT_MEDIA_SFU = true;

export const getDemoCloudConfig = (): DemoCloudConfig => ({
  credentials: {
    apiUserName: DEMO_MEDIASFU_API_USERNAME,
    apiKey: DEMO_MEDIASFU_API_KEY,
  },
  localLink: '',
  connectMediaSFU: DEMO_CONNECT_MEDIA_SFU,
});
