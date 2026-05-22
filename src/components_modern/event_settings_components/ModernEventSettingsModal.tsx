import React, { useEffect, useState } from 'react';
import {
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
	useWindowDimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';
import type { EventSettingsModalOptions } from '../../components/eventSettingsComponents/EventSettingsModal';
import { modifySettings } from '../../methods/settingsMethods/modifySettings';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';
import { createThemedPickerSelectStyles, getModalBodyTheme } from '../core/modalBodyTheme';

type ModernEventRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernEventSettingsModalProps extends EventSettingsModalOptions {
	renderMode?: ModernEventRenderMode;
}

const permissionOptions = [
	{ label: 'Disallow', value: 'disallow' },
	{ label: 'Allow', value: 'allow' },
	{ label: 'Upon approval', value: 'approval' },
];

const chatOptions = [
	{ label: 'Disallow', value: 'disallow' },
	{ label: 'Allow', value: 'allow' },
];

export const ModernEventSettingsModal: React.FC<ModernEventSettingsModalProps> = ({
	isEventSettingsModalVisible,
	onEventSettingsClose,
	onModifyEventSettings = modifySettings,
	audioSetting,
	videoSetting,
	screenshareSetting,
	chatSetting,
	position = 'topRight',
	backgroundColor,
	isDarkMode,
	updateAudioSetting,
	updateVideoSetting,
	updateScreenshareSetting,
	updateChatSetting,
	updateIsSettingsModalVisible,
	roomName,
	socket,
	showAlert,
	style,
	renderContent,
	renderContainer,
	renderMode = 'modal',
}) => {
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const darkMode = resolveIsDarkMode({ isDarkMode, backgroundColor } as any);
	const colors = getModernColors(darkMode);
	const modalTheme = getModalBodyTheme(darkMode);
	const pickerTheme = createThemedPickerSelectStyles(modalTheme);
	const isEmbedded = renderMode === 'sidebar' || renderMode === 'inline';
	const useDesktopSidePanel = !isEmbedded && Platform.OS === 'web' && windowWidth >= 1200;
	const modalWidth = Math.min(Math.max(windowWidth * 0.84, 320), useDesktopSidePanel ? 420 : 460);
	const modalHeight = Math.min(Math.max(windowHeight * 0.74, 500), 780);
	const dimensions = { width: modalWidth, height: modalHeight };

	const [audioState, setAudioState] = useState(audioSetting);
	const [videoState, setVideoState] = useState(videoSetting);
	const [screenshareState, setScreenshareState] = useState(screenshareSetting);
	const [chatState, setChatState] = useState(chatSetting);

	useEffect(() => {
		if (!isEventSettingsModalVisible) {
			return;
		}

		setAudioState(audioSetting);
		setVideoState(videoSetting);
		setScreenshareState(screenshareSetting);
		setChatState(chatSetting);
	}, [isEventSettingsModalVisible, audioSetting, videoSetting, screenshareSetting, chatSetting]);

	if (!isEmbedded && !isEventSettingsModalVisible) {
		return null;
	}

	const handleSaveSettings = async () => {
		try {
			await onModifyEventSettings({
				audioSet: audioState,
				videoSet: videoState,
				screenshareSet: screenshareState,
				chatSet: chatState,
				updateAudioSetting,
				updateVideoSetting,
				updateScreenshareSetting,
				updateChatSetting,
				updateIsSettingsModalVisible,
				roomName,
				socket,
				showAlert,
			});
			onEventSettingsClose();
		} catch {
			showAlert?.({ message: 'Failed to save settings.', type: 'danger' });
		}
	};

	const renderField = (
		title: string,
		description: string,
		value: string,
		onValueChange: (nextValue: string) => void,
		items: Array<{ label: string; value: string }>,
	) => (
		<View style={[styles.fieldCard, { borderColor: colors.border, backgroundColor: colors.surfaceStrong }]}> 
			<Text style={[styles.fieldTitle, { color: colors.text }]}>{title}</Text>
			<Text style={[styles.fieldDescription, { color: colors.textMuted }]}>{description}</Text>
			<RNPickerSelect
				onValueChange={onValueChange}
				items={items}
				value={value}
				style={pickerTheme}
				placeholder={{}}
				useNativeAndroidPickerStyle={false}
			/>
		</View>
	);

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}> 
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}> 
						<FontAwesome5 name="sliders-h" size={15} color={colors.accent} />
					</View>
					<View style={styles.titleCopy}>
						<Text style={[styles.titleText, { color: colors.text }]}>Event Settings</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Set what participants can do without leaving the room</Text>
					</View>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close event settings"
					onPress={onEventSettingsClose}
					style={({ pressed }) => [
						styles.iconButton,
						{
							borderColor: colors.border,
							backgroundColor: pressed ? colors.accentSoft : colors.surfaceStrong,
						},
					]}
				>
					<FontAwesome5 name="times" size={14} color={colors.textMuted} />
				</Pressable>
			</View>

			<ScrollView contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false} style={styles.body}>
				<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Permissions</Text>
					<Text style={[styles.panelTitle, { color: colors.text }]}>Participant access policy</Text>
					<Text style={[styles.panelBodyText, { color: colors.textMuted }]}>Apply host-level rules for audio, video, screen share, and chat access across the room.</Text>
					<View style={styles.fieldStack}>
						{renderField('User Audio', 'Control when participants can unmute or request microphone access.', audioState, (value) => {
							setAudioState(value);
							updateAudioSetting(value);
						}, permissionOptions)}
						{renderField('User Video', 'Control when participants can enable their camera.', videoState, (value) => {
							setVideoState(value);
							updateVideoSetting(value);
						}, permissionOptions)}
						{renderField('User Screenshare', 'Control whether participants can share screens directly or request approval.', screenshareState, (value) => {
							setScreenshareState(value);
							updateScreenshareSetting(value);
						}, permissionOptions)}
						{renderField('User Chat', 'Allow or block participant chat messages in the room.', chatState, (value) => {
							setChatState(value);
							updateChatSetting(value);
						}, chatOptions)}
					</View>
				</View>
			</ScrollView>

			<View style={[styles.footer, { borderTopColor: colors.border }]}> 
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Save event settings"
					onPress={() => void handleSaveSettings()}
					style={({ pressed }) => [
						styles.primaryButton,
						{
							backgroundColor: pressed ? colors.accentAlt : colors.accent,
							borderColor: pressed ? colors.accentAlt : colors.accent,
						},
					]}
				>
					<Text style={[styles.primaryButtonText, { color: colors.invertedText }]}>Save</Text>
				</Pressable>
			</View>
		</View>
	);

	const content = renderContent ? renderContent({ defaultContent: contentBody, dimensions }) : contentBody;

	if (isEmbedded) {
		return (
			<View style={styles.embeddedContainer}>
				<View style={[styles.embeddedShell, { backgroundColor: backgroundColor ?? colors.surface }, style]}>{content}</View>
			</View>
		);
	}

	const overlayStyle = [
		styles.modalContainer,
		useDesktopSidePanel ? styles.desktopSidebarContainer : getModalPosition({ position }),
		{ backgroundColor: useDesktopSidePanel ? 'rgba(15, 23, 42, 0.14)' : 'rgba(15, 23, 42, 0.28)' },
	];

	const shellStyle = [
		styles.modalShell,
		getModernModalCardStyle(darkMode),
		useDesktopSidePanel ? getModernSidePanelStyle(darkMode) : { width: modalWidth, height: modalHeight },
		{ backgroundColor: backgroundColor ?? colors.surface },
		style,
	];

	const defaultContainer = (
		<Modal animationType="fade" transparent visible={isEventSettingsModalVisible} onRequestClose={onEventSettingsClose}>
			<Pressable onPress={onEventSettingsClose} style={overlayStyle}>
				<Pressable onPress={() => undefined} style={shellStyle}>
					{content}
				</Pressable>
			</Pressable>
		</Modal>
	);

	return renderContainer
		? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
		: defaultContainer;
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		padding: 12,
	},
	desktopSidebarContainer: {
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		padding: 0,
	},
	modalShell: {
		overflow: 'hidden',
	},
	embeddedContainer: {
		flex: 1,
		minHeight: 0,
		width: '100%',
	},
	embeddedShell: {
		flex: 1,
		minHeight: 0,
		width: '100%',
	},
	contentShell: {
		flex: 1,
		minHeight: 0,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 18,
		paddingVertical: 16,
		borderBottomWidth: 1,
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flexShrink: 1,
	} as any,
	titleCopy: {
		flexShrink: 1,
	},
	titleIcon: {
		width: 34,
		height: 34,
		borderRadius: 17,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		fontSize: 18,
		fontWeight: '800',
	},
	subtitleText: {
		fontSize: 12,
		lineHeight: 18,
		marginTop: 2,
	},
	iconButton: {
		width: 34,
		height: 34,
		borderRadius: 17,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	body: {
		flex: 1,
	},
	bodyContent: {
		padding: 18,
	},
	panel: {
		borderWidth: 1,
		borderRadius: 18,
		padding: 16,
	},
	panelEyebrow: {
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 0.6,
		textTransform: 'uppercase',
		marginBottom: 4,
	},
	panelTitle: {
		fontSize: 16,
		fontWeight: '800',
	},
	panelBodyText: {
		fontSize: 13,
		lineHeight: 19,
		marginTop: 6,
		marginBottom: 14,
	},
	fieldStack: {
		gap: 12,
	} as any,
	fieldCard: {
		borderWidth: 1,
		borderRadius: 14,
		padding: 14,
	},
	fieldTitle: {
		fontSize: 14,
		fontWeight: '700',
	},
	fieldDescription: {
		fontSize: 12,
		lineHeight: 18,
		marginTop: 4,
		marginBottom: 10,
	},
	footer: {
		borderTopWidth: 1,
		paddingHorizontal: 18,
		paddingTop: 14,
		paddingBottom: 18,
	},
	primaryButton: {
		minHeight: 46,
		borderRadius: 14,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButtonText: {
		fontSize: 14,
		fontWeight: '800',
	},
});

export default ModernEventSettingsModal;