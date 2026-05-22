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
import type { DisplaySettingsModalOptions } from '../../components/displaySettingsComponents/DisplaySettingsModal';
import { modifyDisplaySettings } from '../../methods/displaySettingsMethods/modifyDisplaySettings';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';
import { createThemedPickerSelectStyles, getModalBodyTheme } from '../core/modalBodyTheme';

type ModernDisplayRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernDisplaySettingsModalProps extends DisplaySettingsModalOptions {
	renderMode?: ModernDisplayRenderMode;
}

export const ModernDisplaySettingsModal: React.FC<ModernDisplaySettingsModalProps> = ({
	isDisplaySettingsModalVisible,
	onDisplaySettingsClose,
	onModifyDisplaySettings = modifyDisplaySettings,
	parameters,
	position = 'topRight',
	backgroundColor,
	isDarkMode,
	style,
	renderContent,
	renderContainer,
	renderMode = 'modal',
}) => {
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const darkMode = resolveIsDarkMode({ isDarkMode, backgroundColor, parameters } as any);
	const colors = getModernColors(darkMode);
	const modalTheme = getModalBodyTheme(darkMode);
	const pickerTheme = createThemedPickerSelectStyles(modalTheme);
	const isEmbedded = renderMode === 'sidebar' || renderMode === 'inline';
	const useDesktopSidePanel = !isEmbedded && Platform.OS === 'web' && windowWidth >= 1200;
	const modalWidth = Math.min(Math.max(windowWidth * 0.84, 320), useDesktopSidePanel ? 420 : 460);
	const modalHeight = Math.min(Math.max(windowHeight * 0.72, 460), 760);
	const dimensions = { width: modalWidth, height: modalHeight };

	const [meetingDisplayTypeState, setMeetingDisplayTypeState] = useState(parameters.meetingDisplayType);
	const [autoWaveState, setAutoWaveState] = useState(parameters.autoWave);
	const [forceFullDisplayState, setForceFullDisplayState] = useState(parameters.forceFullDisplay);
	const [showSubtitlesOnCardsState, setShowSubtitlesOnCardsState] = useState(parameters.showSubtitlesOnCards ?? true);
	const [meetingVideoOptimizedState, setMeetingVideoOptimizedState] = useState(parameters.meetingVideoOptimized);

	useEffect(() => {
		if (!isDisplaySettingsModalVisible) {
			return;
		}

		setMeetingDisplayTypeState(parameters.meetingDisplayType);
		setAutoWaveState(parameters.autoWave);
		setForceFullDisplayState(parameters.forceFullDisplay);
		setShowSubtitlesOnCardsState(parameters.showSubtitlesOnCards ?? true);
		setMeetingVideoOptimizedState(parameters.meetingVideoOptimized);
	}, [
		isDisplaySettingsModalVisible,
		parameters.autoWave,
		parameters.forceFullDisplay,
		parameters.meetingDisplayType,
		parameters.meetingVideoOptimized,
		parameters.showSubtitlesOnCards,
	]);

	if (!isEmbedded && !isDisplaySettingsModalVisible) {
		return null;
	}

	const handleSaveSettings = async () => {
		await onModifyDisplaySettings({
			parameters: {
				...parameters,
				meetingDisplayType: meetingDisplayTypeState,
				autoWave: autoWaveState,
				forceFullDisplay: forceFullDisplayState,
				showSubtitlesOnCards: showSubtitlesOnCardsState,
				meetingVideoOptimized: meetingVideoOptimizedState,
			},
		});

		onDisplaySettingsClose();
	};

	const renderToggleRow = (
		title: string,
		description: string,
		value: boolean,
		onToggle: () => void,
	) => (
		<View style={[styles.toggleRow, { borderColor: colors.border, backgroundColor: colors.surfaceStrong }]}> 
			<View style={styles.toggleCopy}>
				<Text style={[styles.toggleTitle, { color: colors.text }]}>{title}</Text>
				<Text style={[styles.toggleDescription, { color: colors.textMuted }]}>{description}</Text>
			</View>
			<Pressable
				accessibilityRole="switch"
				accessibilityLabel={title}
				onPress={onToggle}
				style={[
					styles.toggleButton,
					{
						borderColor: value ? colors.accent : colors.border,
						backgroundColor: value ? colors.accentSoft : colors.surfaceMuted,
					},
				]}
			>
				<FontAwesome5 name={value ? 'check' : 'minus'} size={13} color={value ? colors.accent : colors.textMuted} />
			</Pressable>
		</View>
	);

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}> 
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}> 
						<FontAwesome5 name="desktop" size={15} color={colors.accent} />
					</View>
					<View style={styles.titleCopy}>
						<Text style={[styles.titleText, { color: colors.text }]}>Display Settings</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Adjust layout behavior, animation, and viewing preferences</Text>
					</View>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close display settings"
					onPress={onDisplaySettingsClose}
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
					<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Layout</Text>
					<Text style={[styles.panelTitle, { color: colors.text }]}>Participant display mode</Text>
					<RNPickerSelect
						onValueChange={(value) => setMeetingDisplayTypeState(value)}
						items={[
							{ label: 'Video Participants Only', value: 'video' },
							{ label: 'Media Participants Only', value: 'media' },
							{ label: 'Show All Participants', value: 'all' },
						]}
						value={meetingDisplayTypeState}
						style={pickerTheme}
						placeholder={{}}
						useNativeAndroidPickerStyle={false}
					/>
				</View>

				<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Playback</Text>
					<Text style={[styles.panelTitle, { color: colors.text }]}>Display behavior</Text>
					<View style={styles.toggleStack}>
						{renderToggleRow('Display Audiographs', 'Animate participant cards based on current audio levels.', autoWaveState, () => setAutoWaveState((value) => !value))}
						{renderToggleRow('Force Full Display', 'Keep the active layout expanded instead of adapting to the room.', forceFullDisplayState, () => setForceFullDisplayState((value) => !value))}
						{renderToggleRow('Force Video Participants', 'Bias the layout toward video participants when media is mixed.', meetingVideoOptimizedState, () => setMeetingVideoOptimizedState((value) => !value))}
						{renderToggleRow('Show Subtitles on Cards', 'Keep subtitle text visible directly on participant cards.', showSubtitlesOnCardsState, () => setShowSubtitlesOnCardsState((value) => !value))}
					</View>
				</View>
			</ScrollView>

			<View style={[styles.footer, { borderTopColor: colors.border }]}> 
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Save display settings"
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
		<Modal animationType="fade" transparent visible={isDisplaySettingsModalVisible} onRequestClose={onDisplaySettingsClose}>
			<Pressable onPress={onDisplaySettingsClose} style={overlayStyle}>
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
		gap: 14,
	} as any,
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
		marginBottom: 12,
	},
	toggleStack: {
		gap: 10,
	} as any,
	toggleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		borderWidth: 1,
		borderRadius: 14,
		paddingHorizontal: 14,
		paddingVertical: 12,
	} as any,
	toggleCopy: {
		flex: 1,
	},
	toggleTitle: {
		fontSize: 14,
		fontWeight: '700',
	},
	toggleDescription: {
		fontSize: 12,
		lineHeight: 18,
		marginTop: 2,
	},
	toggleButton: {
		width: 34,
		height: 34,
		borderRadius: 17,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
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

export default ModernDisplaySettingsModal;