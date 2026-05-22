import React from 'react';
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
import type { RecordingModalOptions } from '../../components/recordingComponents/RecordingModal';
import StandardPanelComponent from '../../components/recordingComponents/StandardPanelComponent';
import AdvancedPanelComponent from '../../components/recordingComponents/AdvancedPanelComponent';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';

type ModernRecordingRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernRecordingModalProps extends RecordingModalOptions {
	renderMode?: ModernRecordingRenderMode;
}

type RecordingDisplayAdviceParameters = {
	meetingDisplayType?: string;
	breakOutRoomStarted?: boolean;
	breakOutRoomEnded?: boolean;
	recordingVideoParticipantsFullRoomSupport?: boolean;
	recordingVideoOptions?: string;
	recordingMediaOptions?: string;
};

const getRecordingDisplayAdvice = (parameters?: RecordingDisplayAdviceParameters) => {
	if (!parameters) {
		return null;
	}

	const normalizedRecordingMediaOptions =
		parameters.recordingMediaOptions === 'all' ? 'video' : parameters.recordingMediaOptions;

	if (
		!parameters.recordingVideoParticipantsFullRoomSupport &&
		parameters.recordingVideoOptions === 'all' &&
		normalizedRecordingMediaOptions === 'video' &&
		parameters.meetingDisplayType === 'all' &&
		!(parameters.breakOutRoomStarted && !parameters.breakOutRoomEnded)
	) {
		return 'Meeting display is set to All. Switch the meeting display to Media before confirming so only participants with active media are captured.';
	}

	return null;
};

export const ModernRecordingModal: React.FC<ModernRecordingModalProps> = ({
	isRecordingModalVisible,
	onClose,
	confirmRecording,
	startRecording,
	parameters,
	backgroundColor,
	isDarkMode,
	position = 'topRight',
	style,
	renderContent,
	renderContainer,
	renderMode = 'modal',
}) => {
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const darkMode = resolveIsDarkMode({ isDarkMode, backgroundColor, parameters } as any);
	const colors = getModernColors(darkMode);
	const isEmbedded = renderMode === 'sidebar' || renderMode === 'inline';
	const useDesktopSidePanel = !isEmbedded && Platform.OS === 'web' && windowWidth >= 1200;
	const modalWidth = Math.min(Math.max(windowWidth * 0.86, 340), useDesktopSidePanel ? 420 : 500);
	const modalHeight = Math.min(Math.max(windowHeight * 0.78, 520), 820);
	const dimensions = { width: modalWidth, height: modalHeight };
	const recordingDisplayAdvice = getRecordingDisplayAdvice(parameters);

	if (!isEmbedded && !isRecordingModalVisible) {
		return null;
	}

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}> 
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}> 
						<FontAwesome5 name="video" size={15} color={colors.accent} />
					</View>
					<View style={styles.titleCopy}>
						<Text style={[styles.titleText, { color: colors.text }]}>Recording</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Configure layout, overlays, and recording output</Text>
					</View>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close recording"
					onPress={onClose}
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
					<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Studio</Text>
					<Text style={[styles.panelTitle, { color: colors.text }]}>Recording configuration</Text>
					<Text style={[styles.panelBodyText, { color: colors.textMuted }]}>Choose the capture layout, orientation, labels, and advanced output options before you start recording.</Text>
					<View style={styles.sectionBlock}>
						<StandardPanelComponent parameters={{ ...parameters, isDarkMode: darkMode }} />
					</View>
					<View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />
					<View style={styles.sectionBlock}>
						<AdvancedPanelComponent parameters={{ ...parameters, isDarkMode: darkMode }} />
					</View>
				</View>
			</ScrollView>

			<View style={[styles.footer, { borderTopColor: colors.border }]}> 
				{recordingDisplayAdvice ? (
					<View style={[styles.adviceBox, { backgroundColor: colors.accentSoft, borderColor: colors.borderStrong }]}> 
						<Text style={[styles.adviceText, { color: colors.text }]}>{recordingDisplayAdvice}</Text>
					</View>
				) : null}

				<View style={styles.buttonRow}>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Confirm recording settings"
						onPress={() => void confirmRecording({ parameters })}
						style={({ pressed }) => [
							styles.button,
							{
								backgroundColor: pressed ? colors.accentSoft : colors.surfaceStrong,
								borderColor: colors.border,
							},
						]}
					>
						<Text style={[styles.secondaryButtonText, { color: colors.text }]}>Confirm</Text>
					</Pressable>
					{!parameters.recordPaused ? (
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Start recording"
							onPress={() => void startRecording({ parameters })}
							style={({ pressed }) => [
								styles.button,
								styles.primaryButton,
								{
									backgroundColor: pressed ? colors.warning : colors.danger,
									borderColor: pressed ? colors.warning : colors.danger,
								},
							]}
						>
							<FontAwesome5 name="play" size={12} color={colors.invertedText} />
							<Text style={[styles.primaryButtonText, { color: colors.invertedText }]}>Start</Text>
						</Pressable>
					) : null}
				</View>
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
		<Modal animationType="fade" transparent visible={isRecordingModalVisible} onRequestClose={onClose}>
			<Pressable onPress={onClose} style={overlayStyle}>
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
	sectionBlock: {
		gap: 12,
	} as any,
	sectionDivider: {
		height: 1,
		marginVertical: 16,
	},
	footer: {
		borderTopWidth: 1,
		paddingHorizontal: 18,
		paddingTop: 14,
		paddingBottom: 18,
		gap: 12,
	} as any,
	adviceBox: {
		borderWidth: 1,
		borderRadius: 14,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	adviceText: {
		fontSize: 13,
		fontWeight: '600',
		lineHeight: 19,
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
	} as any,
	button: {
		flex: 1,
		minHeight: 46,
		borderRadius: 14,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButton: {
		flexDirection: 'row',
		gap: 8,
	} as any,
	secondaryButtonText: {
		fontSize: 14,
		fontWeight: '800',
	},
	primaryButtonText: {
		fontSize: 14,
		fontWeight: '800',
	},
});

export default ModernRecordingModal;