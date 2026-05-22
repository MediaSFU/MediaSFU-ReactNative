import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import type { MessagesModalOptions } from '../../components/messageComponents/MessagesModal';
import type { Message } from '../../@types/types';
import { sendMessage } from '../../methods/messageMethods/sendMessage';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';

type ModernMessagesRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernMessagesModalProps extends MessagesModalOptions {
	renderMode?: ModernMessagesRenderMode;
}

type ReplyInfo = {
	text: string;
	username: string;
};

const isDirectMessagingEvent = (eventType: MessagesModalOptions['eventType']) => (
	eventType === 'conference' || eventType === 'webinar'
);

export const ModernMessagesModal: React.FC<ModernMessagesModalProps> = ({
	isMessagesModalVisible,
	onMessagesClose,
	onSendMessagePress = sendMessage,
	messages,
	position = 'topRight',
	backgroundColor,
	isDarkMode,
	eventType,
	member,
	islevel,
	coHostResponsibility,
	coHost,
	startDirectMessage,
	directMessageDetails,
	updateStartDirectMessage,
	updateDirectMessageDetails,
	showAlert,
	roomName,
	socket,
	chatSetting,
	style,
	renderContent,
	renderContainer,
	renderMode = 'modal',
}) => {
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const darkMode = resolveIsDarkMode({ isDarkMode, backgroundColor } as any);
	const colors = getModernColors(darkMode);
	const showDirectTab = isDirectMessagingEvent(eventType);
	const isEmbedded = renderMode === 'sidebar' || renderMode === 'inline';
	const useDesktopSidePanel = !isEmbedded && Platform.OS === 'web' && windowWidth >= 1200;
	const modalWidth = useMemo(
		() => Math.min(Math.max(windowWidth * 0.88, 320), useDesktopSidePanel ? 420 : 460),
		[useDesktopSidePanel, windowWidth],
	);
	const modalHeight = useMemo(
		() => Math.min(Math.max(windowHeight * 0.72, 420), 680),
		[windowHeight],
	);
	const dimensions = useMemo(() => ({ width: modalWidth, height: modalHeight }), [modalHeight, modalWidth]);

	const [activeTab, setActiveTab] = useState<'direct' | 'group'>(showDirectTab ? 'direct' : 'group');
	const [directMessageText, setDirectMessageText] = useState('');
	const [groupMessageText, setGroupMessageText] = useState('');
	const [replyInfo, setReplyInfo] = useState<ReplyInfo | null>(null);
	const [senderId, setSenderId] = useState<string | null>(null);
	const [focusedInput, setFocusedInput] = useState(false);

	const inputRef = useRef<TextInput | null>(null);
	const scrollViewRef = useRef<ScrollView | null>(null);

	useEffect(() => {
		if (!showDirectTab && activeTab !== 'group') {
			setActiveTab('group');
		}
	}, [activeTab, showDirectTab]);

	useEffect(() => {
		if (startDirectMessage && directMessageDetails && showDirectTab) {
			setActiveTab('direct');
			setFocusedInput(true);
			setReplyInfo({ text: 'Replying to:', username: directMessageDetails.name });
			setSenderId(directMessageDetails.name);
			return;
		}

		if (!showDirectTab) {
			setFocusedInput(false);
		}
	}, [directMessageDetails, showDirectTab, startDirectMessage]);

	useEffect(() => {
		if (focusedInput && activeTab === 'direct') {
			const focusHandle = setTimeout(() => {
				inputRef.current?.focus();
			}, 0);

			return () => clearTimeout(focusHandle);
		}

		return undefined;
	}, [activeTab, focusedInput, senderId]);

	const directMessages = useMemo(() => {
		const chatAllowed = coHostResponsibility?.find((item: { name: string; value: boolean }) => item.name === 'chat')?.value;

		return messages.filter(
			(message) =>
				!message.group &&
				(message.sender === member ||
					message.receivers.includes(member) ||
					islevel === '2' ||
					(coHost === member && chatAllowed === true)),
		);
	}, [coHost, coHostResponsibility, islevel, member, messages]);

	const groupMessages = useMemo(() => messages.filter((message) => message.group), [messages]);

	const currentMessages = activeTab === 'direct' ? directMessages : groupMessages;
	const currentMessageText = activeTab === 'direct' ? directMessageText : groupMessageText;

	const setCurrentMessageText = useCallback(
		(value: string) => {
			if (activeTab === 'direct') {
				setDirectMessageText(value);
				return;
			}

			setGroupMessageText(value);
		},
		[activeTab],
	);

	const switchToDirect = useCallback(() => {
		if (!showDirectTab) {
			return;
		}

		setActiveTab('direct');
		setFocusedInput(true);
	}, [showDirectTab]);

	const switchToGroup = useCallback(() => {
		setActiveTab('group');
		setFocusedInput(false);
	}, []);

	const openReplyInput = useCallback(
		(nextSenderId: string) => {
			setActiveTab('direct');
			setFocusedInput(true);
			setReplyInfo({ text: 'Replying to:', username: nextSenderId });
			setSenderId(nextSenderId);
			updateDirectMessageDetails(null);
			updateStartDirectMessage(false);
		},
		[updateDirectMessageDetails, updateStartDirectMessage],
	);

	const resetDirectMessageState = useCallback(() => {
		setReplyInfo(null);
		setSenderId(null);
		setFocusedInput(false);
		updateDirectMessageDetails(null);
		updateStartDirectMessage(false);
	}, [updateDirectMessageDetails, updateStartDirectMessage]);

	const handleSend = useCallback(async () => {
		const message = currentMessageText;

		if (!message) {
			showAlert?.({
				message: 'Please enter a message',
				type: 'danger',
				duration: 3000,
			});
			return;
		}

		if (message.length > 350) {
			showAlert?.({
				message: 'Message is too long',
				type: 'danger',
				duration: 3000,
			});
			return;
		}

		if (message.trim() === '') {
			showAlert?.({
				message: 'Message is not valid.',
				type: 'danger',
				duration: 3000,
			});
			return;
		}

		if (activeTab === 'direct' && !senderId && islevel === '2') {
			showAlert?.({
				message: 'Please select a message to reply to',
				type: 'danger',
				duration: 3000,
			});
			return;
		}

		try {
			await onSendMessagePress({
				message,
				receivers: activeTab === 'direct' && senderId ? [senderId] : [],
				group: activeTab === 'group',
				messagesLength: messages.length,
				member,
				sender: member,
				islevel,
				showAlert,
				coHostResponsibility,
				coHost,
				roomName,
				socket,
				chatSetting,
			});

			if (activeTab === 'direct') {
				setDirectMessageText('');
				resetDirectMessageState();
			} else {
				setGroupMessageText('');
			}
		} catch {
			showAlert?.({
				message: 'Failed to send message.',
				type: 'danger',
				duration: 3000,
			});
		}
	}, [
		activeTab,
		chatSetting,
		coHost,
		coHostResponsibility,
		currentMessageText,
		islevel,
		member,
		messages.length,
		onSendMessagePress,
		resetDirectMessageState,
		roomName,
		senderId,
		showAlert,
		socket,
	]);

	const getPlaceholder = useCallback(() => {
		if (activeTab === 'direct') {
			if (senderId) {
				return `Send a direct message to ${senderId}`;
			}

			if (directMessageDetails) {
				return `Send a direct message to ${directMessageDetails.name}`;
			}

			if (islevel !== '2') {
				return 'Send a direct message to the host';
			}

			return 'Select a message to reply to';
		}

		return eventType === 'chat' ? 'Send a message' : 'Send a message to everyone';
	}, [activeTab, directMessageDetails, eventType, islevel, senderId]);

	const showSelectRecipientNotice = activeTab === 'direct' && !senderId && islevel === '2';
	const showPrivacyNotice = activeTab === 'direct' && islevel !== '2';

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}> 
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}> 
						<FontAwesome5 name="comments" size={15} color={colors.accent} />
					</View>
					<View>
						<Text style={[styles.titleText, { color: colors.text }]}>Messages</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Room chat and direct replies</Text>
					</View>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close messages"
					onPress={onMessagesClose}
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

			{showDirectTab ? (
				<View style={[styles.tabsContainer, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}> 
					<Pressable
						accessibilityRole="button"
						accessibilityState={{ selected: activeTab === 'direct' }}
						onPress={switchToDirect}
						style={({ pressed }) => [
							styles.tabButton,
							{
								backgroundColor:
									activeTab === 'direct'
										? colors.accent
										: pressed
										? colors.accentSoft
										: 'transparent',
							},
						]}
					>
						<FontAwesome5 name="user" size={12} color={activeTab === 'direct' ? colors.invertedText : colors.textMuted} />
						<Text style={[styles.tabText, { color: activeTab === 'direct' ? colors.invertedText : colors.textMuted }]}>Direct</Text>
						{directMessages.length > 0 ? (
							<View
								style={[
									styles.tabBadge,
									{
										backgroundColor: activeTab === 'direct' ? 'rgba(255,255,255,0.18)' : colors.accentSoft,
									},
								]}
							>
								<Text style={[styles.tabBadgeText, { color: activeTab === 'direct' ? colors.invertedText : colors.accent }]}>
									{directMessages.length}
								</Text>
							</View>
						) : null}
					</Pressable>
					<Pressable
						accessibilityRole="button"
						accessibilityState={{ selected: activeTab === 'group' }}
						onPress={switchToGroup}
						style={({ pressed }) => [
							styles.tabButton,
							{
								backgroundColor:
									activeTab === 'group'
										? colors.accent
										: pressed
										? colors.accentSoft
										: 'transparent',
							},
						]}
					>
						<FontAwesome5 name="users" size={12} color={activeTab === 'group' ? colors.invertedText : colors.textMuted} />
						<Text style={[styles.tabText, { color: activeTab === 'group' ? colors.invertedText : colors.textMuted }]}>Group</Text>
						{groupMessages.length > 0 ? (
							<View
								style={[
									styles.tabBadge,
									{
										backgroundColor: activeTab === 'group' ? 'rgba(255,255,255,0.18)' : colors.accentSoft,
									},
								]}
							>
								<Text style={[styles.tabBadgeText, { color: activeTab === 'group' ? colors.invertedText : colors.accent }]}>
									{groupMessages.length}
								</Text>
							</View>
						) : null}
					</Pressable>
				</View>
			) : null}

			<View style={styles.body}>
				{showSelectRecipientNotice ? (
					<View
						style={[
							styles.noticeCard,
							{
								backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)',
								borderColor: darkMode ? 'rgba(96, 165, 250, 0.22)' : 'rgba(37, 99, 235, 0.16)',
							},
						]}
					>
						<View style={styles.noticeTitleRow}>
							<FontAwesome5 name="user-friends" size={12} color={colors.accent} />
							<Text style={[styles.noticeTitleText, { color: colors.accent }]}>Select a recipient</Text>
						</View>
						<Text style={[styles.noticeBodyText, { color: colors.textMuted }]}>Reply to a direct message above, or start a message from the Participants panel.</Text>
					</View>
				) : null}

				{showPrivacyNotice ? (
					<View
						style={[
							styles.noticeCard,
							{
								backgroundColor: darkMode ? 'rgba(234, 179, 8, 0.12)' : 'rgba(245, 158, 11, 0.08)',
								borderColor: darkMode ? 'rgba(250, 204, 21, 0.18)' : 'rgba(217, 119, 6, 0.14)',
							},
						]}
					>
						<View style={styles.noticeTitleRow}>
							<FontAwesome5 name="lock" size={12} color={darkMode ? '#fcd34d' : '#b45309'} />
							<Text style={[styles.noticeTitleText, { color: darkMode ? '#fcd34d' : '#b45309' }]}>Private messages</Text>
						</View>
						<Text style={[styles.noticeBodyText, { color: colors.textMuted }]}>Direct messages you send here go straight to the host and stay private.</Text>
					</View>
				) : null}

				<View style={[styles.messagesPanel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					{currentMessages.length === 0 ? (
						<View style={styles.emptyState}>
							<View style={[styles.emptyStateIcon, { backgroundColor: colors.accentSoft }]}> 
								<FontAwesome5
									name={activeTab === 'direct' ? 'user' : 'users'}
									size={18}
									color={colors.accent}
								/>
							</View>
							<Text style={[styles.emptyStateTitle, { color: colors.text }]}> 
								{activeTab === 'direct' ? 'No direct messages yet' : 'No group messages yet'}
							</Text>
							<Text style={[styles.emptyStateBody, { color: colors.textMuted }]}> 
								{activeTab === 'direct'
									? islevel === '2'
										? 'Start a conversation by replying to a message or using the Participants panel.'
										: 'Send a private message to the host from here.'
									: 'Send a message to everyone in the room.'}
							</Text>
						</View>
					) : (
						<ScrollView
							ref={scrollViewRef}
							contentContainerStyle={styles.messagesList}
							onContentSizeChange={() => {
								scrollViewRef.current?.scrollToEnd({ animated: true });
							}}
							showsVerticalScrollIndicator={false}
						>
							{currentMessages.map((message: Message, index: number) => {
								const isMine = message.sender === member;
								const directReceiverLabel = isMine && !message.group
									? message.receivers
										.filter((receiver) => typeof receiver === 'string' && receiver.trim().length > 0)
										.join(', ')
									: '';
								const metaBadgeBackgroundColor = isMine ? 'rgba(255,255,255,0.12)' : colors.surfaceStrong;
								const metaBadgeBorderColor = isMine ? 'rgba(255,255,255,0.18)' : colors.border;
								const metaTextColor = isMine ? 'rgba(255,255,255,0.82)' : colors.textMuted;
								const timestampBadgeBackgroundColor = isMine ? 'rgba(255,255,255,0.16)' : colors.surfaceStrong;
								const timestampTextColor = isMine ? 'rgba(255,255,255,0.78)' : colors.textMuted;

								return (
									<View
										key={`${message.sender}-${message.timestamp}-${index}`}
										style={[
											styles.messageBubble,
											isMine ? styles.messageBubbleMine : styles.messageBubbleOther,
											{
												alignSelf: isMine ? 'flex-end' : 'flex-start',
												backgroundColor: isMine ? colors.accent : colors.surfaceMuted,
												borderColor: isMine ? colors.accent : colors.border,
											},
										]}
									>
										<View style={styles.messageMetaRow}>
											<View style={styles.messageMetaTextRow}>
												{directReceiverLabel ? (
													<View
														style={[
															styles.messageMetaBadge,
															{
																backgroundColor: metaBadgeBackgroundColor,
																borderColor: metaBadgeBorderColor,
															},
														]}
													>
														<Text style={[styles.receiverText, { color: metaTextColor }]}> 
															To {directReceiverLabel}
														</Text>
													</View>
												) : null}
												{!isMine ? (
													<View
														style={[
															styles.messageMetaBadge,
															styles.senderBadge,
															{
																backgroundColor: colors.surfaceStrong,
																borderColor: colors.border,
															},
														]}
													>
														<Text style={[styles.senderText, { color: colors.text }]}>{message.sender}</Text>
													</View>
												) : null}
											</View>
											<View style={styles.messageMetaActions}>
												<View
													style={[
														styles.timestampBadge,
														{
															backgroundColor: timestampBadgeBackgroundColor,
															borderColor: metaBadgeBorderColor,
														},
													]}
												>
													<FontAwesome5 name="clock" size={9} color={timestampTextColor} />
													<Text style={[styles.timestampText, { color: timestampTextColor }]}> 
														{message.timestamp}
													</Text>
												</View>
												{!isMine && !message.group ? (
													<Pressable
														accessibilityRole="button"
														accessibilityLabel={`Reply to ${message.sender}`}
														onPress={() => openReplyInput(message.sender)}
														style={({ pressed }) => [
															styles.replyButton,
															{
																backgroundColor: pressed ? colors.accentSoft : colors.surfaceStrong,
																borderColor: colors.border,
															},
														]}
													>
														<FontAwesome5 name="reply" size={11} color={colors.textMuted} />
													</Pressable>
												) : null}
											</View>
										</View>
										<Text style={[styles.messageText, { color: isMine ? colors.invertedText : colors.text }]}>
											{message.message}
										</Text>
									</View>
								);
							})}
						</ScrollView>
					)}
				</View>

				<View style={[styles.inputSection, { borderTopColor: colors.border }]}> 
					{replyInfo ? (
						<View
							style={[
								styles.replyBanner,
								{
									backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.14)' : 'rgba(37, 99, 235, 0.1)',
									borderColor: darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.16)',
								},
							]}
						>
							<View style={styles.replyBannerTextRow}>
								<FontAwesome5 name="reply" size={11} color={colors.accent} />
								<Text style={[styles.replyBannerLabel, { color: colors.accent }]}>{replyInfo.text}</Text>
								<Text style={[styles.replyBannerValue, { color: darkMode ? '#fcd34d' : '#b45309' }]}>{replyInfo.username}</Text>
							</View>
							<Pressable
								accessibilityRole="button"
								accessibilityLabel="Clear direct message recipient"
								onPress={resetDirectMessageState}
								style={({ pressed }) => [
									styles.replyBannerDismiss,
									{ backgroundColor: pressed ? colors.accentSoft : 'transparent' },
								]}
							>
								<FontAwesome5 name="times" size={11} color={colors.textMuted} />
							</Pressable>
						</View>
					) : null}

					<View style={styles.inputRow}>
						<TextInput
							ref={inputRef}
							multiline
							maxLength={350}
							onChangeText={setCurrentMessageText}
							placeholder={getPlaceholder()}
							placeholderTextColor={colors.textMuted}
							style={[
								styles.input,
								{
									backgroundColor: colors.surfaceStrong,
									borderColor: colors.border,
									color: colors.text,
								},
							]}
							textAlignVertical="top"
							value={currentMessageText}
						/>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={activeTab === 'direct' && senderId ? `Send to ${senderId}` : 'Send message'}
							disabled={!currentMessageText.trim()}
							onPress={handleSend}
							style={({ pressed }) => [
								styles.sendButton,
								{
									backgroundColor: !currentMessageText.trim()
										? colors.surfaceMuted
										: pressed
										? colors.accentAlt
										: colors.accent,
									opacity: !currentMessageText.trim() ? 0.62 : 1,
								},
							]}
						>
							<FontAwesome5 name="paper-plane" size={14} color={colors.invertedText} />
						</Pressable>
					</View>
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
		<Modal
			animationType="fade"
			transparent
			visible={isMessagesModalVisible}
			onRequestClose={onMessagesClose}
		>
			<Pressable onPress={onMessagesClose} style={overlayStyle}>
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
		overflow: 'hidden',
	},
	embeddedShell: {
		flex: 1,
		minHeight: 0,
		width: '100%',
		overflow: 'hidden',
	},
	contentShell: {
		flex: 1,
		minHeight: 0,
		overflow: 'hidden',
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
	iconButton: {
		width: 38,
		height: 38,
		borderRadius: 19,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tabsContainer: {
		flexDirection: 'row',
		borderWidth: 1,
		borderRadius: 999,
		marginHorizontal: 20,
		marginTop: 16,
		padding: 4,
		flexShrink: 0,
	},
	tabButton: {
		flex: 1,
		minWidth: 0,
		borderRadius: 999,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	tabText: {
		fontSize: 13,
		fontWeight: '700',
		marginLeft: 8,
	},
	tabBadge: {
		minWidth: 20,
		height: 20,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 8,
		paddingHorizontal: 6,
	},
	tabBadgeText: {
		fontSize: 11,
		fontWeight: '800',
	},
	body: {
		flex: 1,
		flexBasis: 0,
		flexShrink: 1,
		minHeight: 0,
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 12,
		overflow: 'hidden',
	},
	noticeCard: {
		borderWidth: 1,
		borderRadius: 16,
		paddingHorizontal: 14,
		paddingVertical: 12,
		marginBottom: 12,
	},
	noticeTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 6,
	},
	noticeTitleText: {
		fontSize: 12,
		fontWeight: '700',
		marginLeft: 8,
	},
	noticeBodyText: {
		fontSize: 12,
		lineHeight: 18,
	},
	messagesPanel: {
		flex: 1,
		flexBasis: 0,
		flexShrink: 1,
		minHeight: 0,
		borderWidth: 1,
		borderRadius: 22,
		overflow: 'hidden',
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
	messagesList: {
		padding: 16,
	},
	messageBubble: {
		maxWidth: '86%',
		borderWidth: 1,
		borderRadius: 20,
		paddingHorizontal: 14,
		paddingVertical: 12,
		marginBottom: 12,
	},
	messageBubbleMine: {
		borderBottomRightRadius: 6,
	},
	messageBubbleOther: {
		borderBottomLeftRadius: 6,
	},
	messageMetaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 6,
	},
	messageMetaTextRow: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		flex: 1,
		marginRight: 8,
		gap: 6,
	},
	messageMetaActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginLeft: 8,
	},
	messageMetaBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	senderBadge: {
		maxWidth: '100%',
	},
	senderText: {
		fontSize: 11,
		fontWeight: '700',
	},
	receiverText: {
		fontSize: 11,
		fontWeight: '600',
	},
	timestampBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 8,
		paddingVertical: 4,
		gap: 5,
	},
	timestampText: {
		fontSize: 10,
		fontWeight: '600',
	},
	replyButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	messageText: {
		fontSize: 14,
		lineHeight: 21,
	},
	inputSection: {
		flexShrink: 0,
		paddingTop: 14,
		marginTop: 14,
		borderTopWidth: 1,
	},
	replyBanner: {
		borderWidth: 1,
		borderRadius: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 12,
	},
	replyBannerTextRow: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		marginRight: 8,
	},
	replyBannerLabel: {
		fontSize: 12,
		fontWeight: '700',
		marginLeft: 8,
		marginRight: 4,
	},
	replyBannerValue: {
		fontSize: 12,
		fontWeight: '700',
	},
	replyBannerDismiss: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	input: {
		flex: 1,
		minHeight: 52,
		maxHeight: 132,
		borderWidth: 1,
		borderRadius: 18,
		paddingHorizontal: 14,
		paddingTop: 12,
		paddingBottom: 12,
		fontSize: 14,
	},
	sendButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 12,
	},
});

export default ModernMessagesModal;