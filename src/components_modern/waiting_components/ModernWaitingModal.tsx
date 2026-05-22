import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
	useWindowDimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import type { WaitingRoomModalOptions } from '../../components/waitingComponents/WaitingModal';
import { respondToWaiting } from '../../methods/waitingMethods/respondToWaiting';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';

type ModernWaitingRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernWaitingModalProps extends WaitingRoomModalOptions {
	renderMode?: ModernWaitingRenderMode;
}

export const ModernWaitingModal: React.FC<ModernWaitingModalProps> = ({
	isWaitingModalVisible,
	onWaitingRoomClose,
	waitingRoomCounter,
	onWaitingRoomFilterChange,
	waitingRoomList,
	updateWaitingList,
	roomName,
	socket,
	position = 'topRight',
	backgroundColor,
	isDarkMode,
	parameters,
	onWaitingRoomItemPress = respondToWaiting,
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
	const modalHeight = Math.min(Math.max(windowHeight * 0.68, 420), 680);
	const dimensions = { width: modalWidth, height: modalHeight };

	const [searchText, setSearchText] = useState('');
	const [waitingListState, setWaitingListState] = useState(waitingRoomList);

	useEffect(() => {
		const updatedParams = parameters?.getUpdatedAllParams?.();
		const nextList = updatedParams?.filteredWaitingRoomList ?? waitingRoomList;
		setWaitingListState(nextList);
	}, [parameters, waitingRoomList, isWaitingModalVisible]);

	const filteredWaitingList = useMemo(() => {
		if (!searchText.trim()) {
			return waitingListState;
		}

		const normalizedSearch = searchText.trim().toLowerCase();
		return waitingListState.filter((participant) => participant.name.toLowerCase().includes(normalizedSearch));
	}, [searchText, waitingListState]);

	const handleFilterChange = useCallback(
		(value: string) => {
			setSearchText(value);
			onWaitingRoomFilterChange(value);
		},
		[onWaitingRoomFilterChange],
	);

	const handleResponse = useCallback(
		async (participant: (typeof waitingListState)[number], type: boolean) => {
			await onWaitingRoomItemPress({
				participantId: participant.id,
				participantName: participant.name,
				updateWaitingList,
				waitingList: waitingListState,
				roomName,
				type,
				socket,
			});
		},
		[onWaitingRoomItemPress, roomName, socket, updateWaitingList, waitingListState],
	);

	if (!isEmbedded && !isWaitingModalVisible) {
		return null;
	}

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}> 
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}> 
						<FontAwesome name="clock-o" size={16} color={colors.accent} />
					</View>
					<View>
						<Text style={[styles.titleText, { color: colors.text }]}>Waiting room</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Review attendees before they enter</Text>
					</View>
				</View>
				<View style={styles.headerActions}>
					<View style={[styles.counterBadge, { backgroundColor: colors.accentSoft }]}> 
						<Text style={[styles.counterBadgeText, { color: colors.accent }]}>{filteredWaitingList.length || waitingRoomCounter}</Text>
					</View>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Close waiting room"
						onPress={onWaitingRoomClose}
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
						placeholder="Search waiting room"
						placeholderTextColor={colors.textMuted}
						style={[styles.searchInput, { color: colors.text }]}
						value={searchText}
					/>
				</View>

				<View style={[styles.listPanel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					{filteredWaitingList.length === 0 ? (
						<View style={styles.emptyState}>
							<View style={[styles.emptyStateIcon, { backgroundColor: colors.accentSoft }]}> 
								<FontAwesome name="users" size={18} color={colors.accent} />
							</View>
							<Text style={[styles.emptyStateTitle, { color: colors.text }]}>No one is waiting</Text>
							<Text style={[styles.emptyStateBody, { color: colors.textMuted }]}>Participants held in the lobby will appear here with accept and reject controls.</Text>
						</View>
					) : (
						<ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
							{filteredWaitingList.map((participant, index) => (
								<View
									key={`${participant.id ?? participant.name}-${index}`}
									style={[
										styles.participantRow,
										{
											backgroundColor: colors.surfaceStrong,
											borderColor: colors.border,
										},
									]}
								>
									<View style={styles.participantCopy}>
										<View style={[styles.participantAvatar, { backgroundColor: colors.accentSoft }]}> 
											<Text style={[styles.participantAvatarText, { color: colors.accent }]}>
												{participant.name.slice(0, 1).toUpperCase()}
											</Text>
										</View>
										<View style={styles.participantCopyText}>
											<Text style={[styles.participantTitle, { color: colors.text }]}>{participant.name}</Text>
											<Text style={[styles.participantMeta, { color: colors.textMuted }]}>Waiting for host approval</Text>
										</View>
									</View>
									<View style={styles.participantActions}>
										<Pressable
											accessibilityRole="button"
											accessibilityLabel={`Admit ${participant.name}`}
											onPress={() => void handleResponse(participant, true)}
											style={({ pressed }) => [
												styles.actionButton,
												{
													backgroundColor: pressed ? colors.accentSoft : darkMode ? 'rgba(22, 163, 74, 0.16)' : 'rgba(22, 163, 74, 0.08)',
													borderColor: darkMode ? 'rgba(74, 222, 128, 0.2)' : 'rgba(22, 163, 74, 0.12)',
												},
											]}
										>
											<FontAwesome name="check" size={16} color={colors.success} />
										</Pressable>
										<Pressable
											accessibilityRole="button"
											accessibilityLabel={`Reject ${participant.name}`}
											onPress={() => void handleResponse(participant, false)}
											style={({ pressed }) => [
												styles.actionButton,
												{
													backgroundColor: pressed ? colors.accentSoft : darkMode ? 'rgba(239, 68, 68, 0.16)' : 'rgba(239, 68, 68, 0.08)',
													borderColor: darkMode ? 'rgba(248, 113, 113, 0.2)' : 'rgba(220, 38, 38, 0.12)',
												},
											]}
										>
											<FontAwesome name="times" size={16} color={colors.danger} />
										</Pressable>
									</View>
								</View>
							))}
						</ScrollView>
					)}
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
		<Modal animationType="fade" transparent visible={isWaitingModalVisible} onRequestClose={onWaitingRoomClose}>
			<Pressable onPress={onWaitingRoomClose} style={overlayStyle}>
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
	},
	listContent: {
		padding: 16,
	},
	participantRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderRadius: 18,
		paddingHorizontal: 14,
		paddingVertical: 12,
		marginBottom: 12,
	},
	participantCopy: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		marginRight: 12,
	},
	participantAvatar: {
		width: 38,
		height: 38,
		borderRadius: 19,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	participantAvatarText: {
		fontSize: 14,
		fontWeight: '800',
	},
	participantCopyText: {
		flex: 1,
	},
	participantTitle: {
		fontSize: 14,
		fontWeight: '700',
		lineHeight: 20,
	},
	participantMeta: {
		fontSize: 12,
		marginTop: 4,
	},
	participantActions: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionButton: {
		width: 38,
		height: 38,
		borderRadius: 19,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 8,
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

export default ModernWaitingModal;