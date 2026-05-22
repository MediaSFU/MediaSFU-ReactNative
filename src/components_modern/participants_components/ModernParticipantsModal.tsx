import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	useWindowDimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ParticipantList from '../../components/participantsComponents/ParticipantList';
import ParticipantListOthers from '../../components/participantsComponents/ParticipantListOthers';
import type {
	ParticipantsModalOptions,
	ParticipantsModalParameters,
} from '../../components/participantsComponents/ParticipantsModal';
import { muteParticipants } from '../../methods/participantsMethods/muteParticipants';
import { messageParticipants } from '../../methods/participantsMethods/messageParticipants';
import { removeParticipants } from '../../methods/participantsMethods/removeParticipants';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';

type ModernParticipantsRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernParticipantsModalProps extends ParticipantsModalOptions {
	renderMode?: ModernParticipantsRenderMode;
}

export const ModernParticipantsModal: React.FC<ModernParticipantsModalProps> = ({
	isParticipantsModalVisible,
	onParticipantsClose,
	onParticipantsFilterChange,
	participantsCounter,
	onMuteParticipants = muteParticipants,
	onMessageParticipants = messageParticipants,
	onRemoveParticipants = removeParticipants,
	RenderParticipantList = ParticipantList,
	RenderParticipantListOthers = ParticipantListOthers,
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
	const modalWidth = Math.min(Math.max(windowWidth * 0.84, 320), useDesktopSidePanel ? 420 : 460);
	const modalHeight = Math.min(Math.max(windowHeight * 0.7, 420), 700);
	const dimensions = { width: modalWidth, height: modalHeight };

	const [filterText, setFilterText] = useState('');
	const [participantList, setParticipantList] = useState(parameters.participants);
	const [participantsCountState, setParticipantsCountState] = useState(participantsCounter);

	useEffect(() => {
		const updatedParams = parameters.getUpdatedAllParams?.() ?? parameters;
		const nextParticipants = updatedParams.filteredParticipants ?? updatedParams.participants ?? [];
		setParticipantList(nextParticipants);
		setParticipantsCountState(nextParticipants.length);
	}, [isParticipantsModalVisible, parameters, participantsCounter]);

	const liveParameters = useMemo<ParticipantsModalParameters>(
		() => parameters.getUpdatedAllParams?.() ?? parameters,
		[parameters, participantList.length],
	);

	const canModerateParticipants = useMemo(() => {
		const hasParticipantsPermission = liveParameters.coHostResponsibility?.find(
			(item: { name: string; value: boolean }) => item.name === 'participants',
		)?.value;

		return liveParameters.islevel === '2' || (liveParameters.coHost === liveParameters.member && hasParticipantsPermission === true);
	}, [liveParameters]);

	const handleFilterChange = useCallback(
		(value: string) => {
			setFilterText(value);
			onParticipantsFilterChange(value);
		},
		[onParticipantsFilterChange],
	);

	if (!isEmbedded && !isParticipantsModalVisible) {
		return null;
	}

	const defaultList = participantList.length > 0 ? (
		canModerateParticipants ? (
			<RenderParticipantList
				participants={participantList}
				isBroadcast={liveParameters.eventType === 'broadcast'}
				onMuteParticipants={onMuteParticipants}
				onMessageParticipants={onMessageParticipants}
				onRemoveParticipants={onRemoveParticipants}
				socket={liveParameters.socket}
				coHostResponsibility={liveParameters.coHostResponsibility}
				member={liveParameters.member}
				islevel={liveParameters.islevel}
				showAlert={liveParameters.showAlert}
				coHost={liveParameters.coHost}
				roomName={liveParameters.roomName}
				updateIsMessagesModalVisible={liveParameters.updateIsMessagesModalVisible}
				updateDirectMessageDetails={liveParameters.updateDirectMessageDetails}
				updateStartDirectMessage={liveParameters.updateStartDirectMessage}
				updateParticipants={liveParameters.updateParticipants}
				isDarkMode={darkMode}
			/>
		) : (
			<RenderParticipantListOthers
				participants={participantList}
				coHost={liveParameters.coHost}
				member={liveParameters.member}
				isDarkMode={darkMode}
			/>
		)
	) : (
		<View style={styles.emptyState}>
			<View style={[styles.emptyStateIcon, { backgroundColor: colors.accentSoft }]}>
				<FontAwesome name="users" size={18} color={colors.accent} />
			</View>
			<Text style={[styles.emptyStateTitle, { color: colors.text }]}>No participants found</Text>
			<Text style={[styles.emptyStateBody, { color: colors.textMuted }]}>Adjust the search or wait for people to join the room.</Text>
		</View>
	);

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}>
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}>
						<FontAwesome name="users" size={16} color={colors.accent} />
					</View>
					<View>
						<Text style={[styles.titleText, { color: colors.text }]}>Participants</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>People in the room and direct-message actions</Text>
					</View>
				</View>
				<View style={styles.headerActions}>
					<View style={[styles.counterBadge, { backgroundColor: colors.accentSoft }]}>
						<Text style={[styles.counterBadgeText, { color: colors.accent }]}>{participantsCountState}</Text>
					</View>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Close participants"
						onPress={onParticipantsClose}
						style={({ pressed }) => [
							styles.iconButton,
							{
								borderColor: colors.border,
								backgroundColor: pressed ? colors.accentSoft : colors.surfaceStrong,
							},
						]}
					>
						<FontAwesome name="times" size={14} color={colors.textMuted} />
					</Pressable>
				</View>
			</View>

			<View style={styles.body}>
				<View style={[styles.searchShell, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}>
					<FontAwesome name="search" size={13} color={colors.textMuted} />
					<TextInput
						onChangeText={handleFilterChange}
						placeholder="Search participants"
						placeholderTextColor={colors.textMuted}
						style={[styles.searchInput, { color: colors.text }]}
						value={filterText}
					/>
				</View>

				<View style={[styles.listPanel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}>
					{defaultList}
				</View>
			</View>
		</View>
	);

	const content = renderContent ? renderContent({ defaultContent: contentBody, dimensions }) : contentBody;

	if (isEmbedded) {
		return (
			<View style={styles.embeddedContainer}>
				<View style={[styles.embeddedShell, { backgroundColor: colors.surface }, style]}>{content}</View>
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
		<Modal transparent animationType="slide" visible={isParticipantsModalVisible} onRequestClose={onParticipantsClose}>
			<Pressable onPress={onParticipantsClose} style={overlayStyle}>
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
		borderBottomWidth: 1,
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		marginRight: 12,
	},
	titleIcon: {
		width: 34,
		height: 34,
		borderRadius: 17,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	titleText: {
		fontSize: 18,
		fontWeight: '700',
	},
	subtitleText: {
		fontSize: 12,
		marginTop: 2,
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	counterBadge: {
		minWidth: 30,
		height: 30,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		paddingHorizontal: 8,
	},
	counterBadgeText: {
		fontSize: 12,
		fontWeight: '800',
	},
	iconButton: {
		width: 38,
		height: 38,
		borderRadius: 19,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	body: {
		flex: 1,
		minHeight: 0,
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 12,
	},
	searchShell: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 18,
		paddingHorizontal: 14,
		paddingVertical: 12,
		marginBottom: 14,
	},
	searchInput: {
		flex: 1,
		fontSize: 14,
		marginLeft: 10,
		paddingVertical: 0,
	},
	listPanel: {
		flex: 1,
		minHeight: 0,
		borderWidth: 1,
		borderRadius: 22,
		overflow: 'hidden',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	emptyState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 28,
	},
	emptyStateIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
	},
	emptyStateTitle: {
		fontSize: 15,
		fontWeight: '700',
		textAlign: 'center',
	},
	emptyStateBody: {
		fontSize: 12,
		lineHeight: 18,
		textAlign: 'center',
		marginTop: 6,
	},
});

export default ModernParticipantsModal;