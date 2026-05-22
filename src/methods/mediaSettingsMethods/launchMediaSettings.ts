import { launchMediaSettings as sharedLaunchMediaSettings } from 'mediasfu-shared';
import { MediaDevices } from '../../@types/types';

export interface LaunchMediaSettingsOptions {
	updateIsMediaSettingsModalVisible: (isVisible: boolean) => void;
	isMediaSettingsModalVisible: boolean;
	mediaDevices: MediaDevices;
	audioInputs: MediaDeviceInfo[];
	videoInputs: MediaDeviceInfo[];
	updateAudioInputs: (inputs: MediaDeviceInfo[]) => void;
	updateVideoInputs: (inputs: MediaDeviceInfo[]) => void;
}

// Export the type definition for the function
export type LaunchMediaSettingsType = (options: LaunchMediaSettingsOptions) => Promise<void>;

export const launchMediaSettings: LaunchMediaSettingsType = async ({
	updateIsMediaSettingsModalVisible,
	isMediaSettingsModalVisible,
	mediaDevices,
	audioInputs,
	videoInputs,
	updateAudioInputs,
	updateVideoInputs,
}: LaunchMediaSettingsOptions): Promise<void> => {
	return sharedLaunchMediaSettings({
		updateIsMediaSettingsModalVisible,
		isMediaSettingsModalVisible,
		mediaDevices: mediaDevices as any,
		audioInputs,
		videoInputs,
		updateAudioInputs,
		updateVideoInputs,
	} as any);
};
