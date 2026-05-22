import React, { useState } from 'react';
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
import type { MenuModalOptions } from '../../components/menuComponents/MenuModal';
import CustomButtons from '../../components/menuComponents/CustomButtons';
import Clipboard from '@react-native-clipboard/clipboard';
import MeetingIdComponent from '../../components/menuComponents/MeetingIDComponent';
import ShareButtonsComponent from '../../components/menuComponents/ShareButtonsComponent';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';

type ModernMenuRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernMenuModalProps extends MenuModalOptions {
	renderMode?: ModernMenuRenderMode;
}

export const ModernMenuModal: React.FC<ModernMenuModalProps> = ({
	backgroundColor,
	isVisible,
	onClose,
	customButtons = [],
	shareButtons = true,
	position = 'topRight',
	roomName,
	adminPasscode,
	islevel,
	eventType,
	localLink,
	isDarkMode,
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
	const modalWidth = Math.min(Math.max(windowWidth * 0.84, 320), useDesktopSidePanel ? 420 : 480);
	const modalHeight = Math.min(Math.max(windowHeight * 0.72, 460), 760);
	const dimensions = { width: modalWidth, height: modalHeight };

	const [showPasscode, setShowPasscode] = useState(false);
	const [copiedPasscode, setCopiedPasscode] = useState(false);

	const handleCopyPasscode = () => {
		if (!adminPasscode) return;
		Clipboard.setString(adminPasscode);
		setCopiedPasscode(true);
		setTimeout(() => setCopiedPasscode(false), 2000);
	};

	if (!isEmbedded && !isVisible) {
		return null;
	}

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}> 
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}> 
						<FontAwesome5 name="bars" size={15} color={colors.accent} />
					</View>
					<View style={styles.titleCopy}>
						<Text style={[styles.titleText, { color: colors.text }]}>Menu</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Meeting details, actions, and quick share tools</Text>
					</View>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close menu"
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
				{customButtons.length > 0 ? (
					<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
						<View style={styles.panelHeader}>
							<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Quick actions</Text>
							<Text style={[styles.panelTitle, { color: colors.text }]}>Room controls</Text>
						</View>
						<CustomButtons buttons={customButtons} isDarkMode={darkMode} />
					</View>
				) : null}

				<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					<View style={styles.panelHeaderRow}>
						<View>
							<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Access</Text>
							<Text style={[styles.panelTitle, { color: colors.text }]}>Meeting credentials</Text>
						</View>
						<View style={[styles.badge, { backgroundColor: colors.accentSoft }]}> 
							<Text style={[styles.badgeText, { color: colors.accent }]}>{eventType}</Text>
						</View>
					</View>
					{islevel === '2' ? (
						<View style={styles.passcodeSection}>
							<View style={styles.passcodeLabelRow}>
								<Text style={[styles.passcodeLabel, { color: colors.textMuted }]}>Event Passcode (Host)</Text>
								<View style={[styles.privateBadge, { backgroundColor: 'rgba(255,59,48,0.1)' }]}>
									<FontAwesome5 name="shield-alt" size={9} color="#FF3B30" />
									<Text style={[styles.privateBadgeText, { color: '#FF3B30' }]}>Private</Text>
								</View>
							</View>
							<View style={[styles.passcodeRow, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
								<Text style={[styles.passcodeValue, { color: colors.text }]} numberOfLines={1}>
									{showPasscode ? (adminPasscode ?? '') : '\u2022'.repeat((adminPasscode ?? '').length || 8)}
								</Text>
								<View style={styles.passcodeActions}>
									<Pressable
										accessibilityRole="button"
										accessibilityLabel={showPasscode ? 'Hide passcode' : 'Show passcode'}
										onPress={() => setShowPasscode(p => !p)}
										style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.6 : 1 }]}
									>
										<FontAwesome5 name={showPasscode ? 'eye-slash' : 'eye'} size={14} color={colors.accent} />
									</Pressable>
									<Pressable
										accessibilityRole="button"
										accessibilityLabel="Copy passcode"
										onPress={handleCopyPasscode}
										style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.6 : 1 }]}
									>
										<FontAwesome5 name={copiedPasscode ? 'check' : 'copy'} size={14} color={colors.accent} />
									</Pressable>
								</View>
							</View>
							<Text style={[styles.passcodeHint, { color: colors.textMuted }]}>
								Others with this passcode can join as host with full privileges.
							</Text>
						</View>
					) : null}
					<MeetingIdComponent meetingID={roomName} isDarkMode={darkMode} />
				</View>

				{shareButtons ? (
					<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
						<View style={styles.panelHeader}>
							<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Invite</Text>
							<Text style={[styles.panelTitle, { color: colors.text }]}>Share this event</Text>
							<Text style={[styles.panelBodyText, { color: colors.textMuted }]}>Copy or send the join link to participants without leaving the room.</Text>
						</View>
						<ShareButtonsComponent
							meetingID={roomName}
							eventType={eventType}
							localLink={localLink}
						/>
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
		<Modal animationType="fade" transparent visible={isVisible} onRequestClose={onClose}>
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
		gap: 14,
	} as any,
	panel: {
		borderWidth: 1,
		borderRadius: 18,
		padding: 16,
	},
	panelHeader: {
		marginBottom: 8,
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
	roomChip: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 8,
	} as any,
	roomChipText: {
		flex: 1,
		fontSize: 13,
		fontWeight: '700',
	},
	passcodeSection: {
		marginBottom: 8,
	},
	passcodeLabelRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 6,
	} as any,
	passcodeLabel: {
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 0.5,
		textTransform: 'uppercase',
	},
	privateBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 7,
		paddingVertical: 3,
		borderRadius: 6,
	} as any,
	privateBadgeText: {
		fontSize: 10,
		fontWeight: '800',
	},
	passcodeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 6,
	},
	passcodeValue: {
		flex: 1,
		fontSize: 14,
		fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
		letterSpacing: 1,
	},
	passcodeActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	} as any,
	actionButton: {
		padding: 6,
	},
	passcodeHint: {
		fontSize: 11,
		fontStyle: 'italic',
		lineHeight: 16,
	},
});

export default ModernMenuModal;