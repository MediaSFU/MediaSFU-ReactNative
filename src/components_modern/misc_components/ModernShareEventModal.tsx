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
import type { ShareEventModalOptions } from '../../components/miscComponents/ShareEventModal';
import MeetingIdComponent from '../../components/menuComponents/MeetingIDComponent';
import MeetingPasscodeComponent from '../../components/menuComponents/MeetingPasscodeComponent';
import ShareButtonsComponent from '../../components/menuComponents/ShareButtonsComponent';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';

type ModernShareEventRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernShareEventModalProps extends ShareEventModalOptions {
	renderMode?: ModernShareEventRenderMode;
}

export const ModernShareEventModal: React.FC<ModernShareEventModalProps> = ({
	backgroundColor,
	isDarkMode,
	isShareEventModalVisible,
	onShareEventClose,
	shareButtons = true,
	position = 'topRight',
	roomName,
	adminPasscode,
	islevel,
	eventType,
	localLink,
	style,
	renderContent,
	renderContainer,
	renderMode = 'modal',
}) => {
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const darkMode = resolveIsDarkMode({ isDarkMode, backgroundColor } as any);
	const colors = getModernColors(darkMode);
	const isEmbedded = renderMode === 'sidebar' || renderMode === 'inline';
	const useDesktopSidePanel = !isEmbedded && Platform.OS === 'web' && windowWidth >= 1200;
	const modalWidth = Math.min(Math.max(windowWidth * 0.84, 320), useDesktopSidePanel ? 420 : 460);
	const modalHeight = Math.min(Math.max(windowHeight * 0.62, 380), 640);
	const dimensions = { width: modalWidth, height: modalHeight };

	if (!isEmbedded && !isShareEventModalVisible) {
		return null;
	}

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}> 
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}> 
						<FontAwesome5 name="share-alt" size={15} color={colors.accent} />
					</View>
					<View style={styles.titleCopy}>
						<Text style={[styles.titleText, { color: colors.text }]}>Share Event</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Copy the invite details and share the join link with attendees</Text>
					</View>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close share event"
					onPress={onShareEventClose}
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
					<View style={styles.panelHeaderRow}>
						<View>
							<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Credentials</Text>
							<Text style={[styles.panelTitle, { color: colors.text }]}>Access details</Text>
						</View>
						<View style={[styles.badge, { backgroundColor: colors.accentSoft }]}> 
							<Text style={[styles.badgeText, { color: colors.accent }]}>{eventType}</Text>
						</View>
					</View>
					{islevel === '2' && adminPasscode ? (
						<MeetingPasscodeComponent meetingPasscode={adminPasscode} isDarkMode={darkMode} />
					) : null}
					<MeetingIdComponent meetingID={roomName} isDarkMode={darkMode} />
				</View>

				{shareButtons ? (
					<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
						<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Invite</Text>
						<Text style={[styles.panelTitle, { color: colors.text }]}>Send the join link</Text>
						<Text style={[styles.panelBodyText, { color: colors.textMuted }]}>Use the quick share controls below to copy or distribute the event link.</Text>
						<ShareButtonsComponent meetingID={roomName} eventType={eventType} localLink={localLink} />
					</View>
				) : null}
			</ScrollView>
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
		<Modal animationType="fade" transparent visible={isShareEventModalVisible} onRequestClose={onShareEventClose}>
			<Pressable onPress={onShareEventClose} style={overlayStyle}>
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
	panelHeaderRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		gap: 12,
		marginBottom: 12,
	} as any,
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
	},
	badge: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
	},
	badgeText: {
		fontSize: 11,
		fontWeight: '800',
		textTransform: 'capitalize',
	},
});

export default ModernShareEventModal;