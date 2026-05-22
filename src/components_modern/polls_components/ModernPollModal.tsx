import React, { useEffect, useState } from 'react';
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
import RNPickerSelect from 'react-native-picker-select';
import type { PollModalOptions } from '../../components/pollsComponents/PollModal';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';
import { createThemedPickerSelectStyles, getModalBodyTheme } from '../core/modalBodyTheme';

type ModernPollRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernPollModalProps extends PollModalOptions {
	renderMode?: ModernPollRenderMode;
}

export const ModernPollModal: React.FC<ModernPollModalProps> = ({
	isPollModalVisible,
	onClose,
	position = 'topRight',
	backgroundColor,
	isDarkMode,
	member,
	islevel,
	polls,
	poll,
	socket,
	roomName,
	showAlert,
	updateIsPollModalVisible,
	handleCreatePoll,
	handleEndPoll,
	handleVotePoll,
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
	const modalWidth = Math.min(Math.max(windowWidth * 0.88, 320), useDesktopSidePanel ? 420 : 500);
	const modalHeight = Math.min(Math.max(windowHeight * 0.78, 520), 820);
	const dimensions = { width: modalWidth, height: modalHeight };

	const [newPoll, setNewPoll] = useState<{ question: string; type: string; options: string[] }>({
		question: '',
		type: '',
		options: [],
	});

	useEffect(() => {
		if (!isPollModalVisible) {
			return;
		}

		let activePollCount = 0;

		polls.forEach((polled) => {
			if (polled.status === 'active' && poll && polled.id === poll.id) {
				activePollCount += 1;
			}
		});

		if (islevel === '2' && activePollCount === 0 && poll && poll.status === 'active') {
			poll.status = 'inactive';
		}
	}, [isPollModalVisible, islevel, poll, polls]);

	if (!isEmbedded && !isPollModalVisible) {
		return null;
	}

	const calculatePercentage = (votes: number[], optionIndex: number) => {
		const totalVotes = votes.reduce((sum, value) => sum + value, 0);
		return totalVotes > 0 ? ((votes[optionIndex] / totalVotes) * 100).toFixed(2) : '0.00';
	};

	const handlePollTypeChange = (type: string) => {
		let options: string[] = [];

		switch (type) {
			case 'trueFalse':
				options = ['True', 'False'];
				break;
			case 'yesNo':
				options = ['Yes', 'No'];
				break;
			case 'custom':
			default:
				options = [];
				break;
		}

		setNewPoll({ ...newPoll, type, options });
	};

	const renderCreateOptions = () => {
		if (newPoll.type === 'trueFalse' || newPoll.type === 'yesNo') {
			return newPoll.options.map((option, index) => (
				<View key={`${option}-${index}`} style={[styles.staticOptionRow, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}> 
					<View style={[styles.optionBullet, { backgroundColor: colors.accent }]} />
					<Text style={[styles.optionTitle, { color: colors.text }]}>{option}</Text>
				</View>
			));
		}

		if (newPoll.type === 'custom') {
			return [...Array(5)].map((_, index) => {
				const value = newPoll.options[index] ?? '';
				return (
					<TextInput
						key={`custom-option-${index}`}
						style={[
							styles.input,
							{
								color: modalTheme.inputTextColor,
								borderColor: modalTheme.borderColor,
								backgroundColor: modalTheme.inputBackgroundColor,
							},
						]}
						placeholder={`Option ${index + 1}`}
						placeholderTextColor={modalTheme.placeholderTextColor}
						maxLength={50}
						value={value}
						onChangeText={(text) => {
							const nextOptions = [...newPoll.options];
							nextOptions[index] = text;
							setNewPoll({ ...newPoll, options: nextOptions });
						}}
					/>
				);
			});
		}

		return null;
	};

	const renderCurrentPollOptions = () => poll?.options.map((option, index) => {
		const selected = !!poll.voters && poll.voters[member] === index;

		return (
			<Pressable
				key={`${option}-${index}`}
				accessibilityRole="button"
				accessibilityLabel={`Vote for ${option}`}
				onPress={() => void handleVotePoll({
					pollId: poll.id,
					optionIndex: index,
					socket,
					showAlert,
					member,
					roomName,
					updateIsPollModalVisible,
				})}
				style={[
					styles.voteOption,
					{
						borderColor: selected ? colors.borderStrong : colors.border,
						backgroundColor: selected ? colors.accentSoft : colors.surfaceStrong,
					},
				]}
			>
				<View style={[styles.radioOuter, { borderColor: selected ? colors.accent : colors.border }]}> 
					{selected ? <View style={[styles.radioInner, { backgroundColor: colors.accent }]} /> : null}
				</View>
				<View style={styles.voteOptionCopy}>
					<Text style={[styles.optionTitle, { color: colors.text }]}>{option}</Text>
				</View>
			</Pressable>
		);
	});

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}> 
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}> 
						<FontAwesome5 name="poll" size={15} color={colors.accent} />
					</View>
					<View style={styles.titleCopy}>
						<Text style={[styles.titleText, { color: colors.text }]}>Polls</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Create polls, capture votes, and review results</Text>
					</View>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close polls"
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
				{islevel === '2' ? (
					<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
						<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Archive</Text>
						<Text style={[styles.panelTitle, { color: colors.text }]}>Previous polls</Text>
						{polls.length === 0 ? (
							<Text style={[styles.emptyStateText, { color: colors.textMuted }]}>No polls available yet.</Text>
						) : (
							polls.map((polled, index) => {
								if (poll && poll.status === 'active' && polled.id === poll.id) {
									return null;
								}

								return (
									<View key={polled.id ?? index} style={[styles.pollCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}> 
										<Text style={[styles.pollQuestion, { color: colors.text }]}>{polled.question}</Text>
										{polled.options.map((option, optionIndex) => (
											<Text key={`${polled.id}-${optionIndex}`} style={[styles.optionMeta, { color: colors.textMuted }]}> 
												{`${option}: ${polled.votes[optionIndex]} votes (${calculatePercentage(polled.votes, optionIndex)}%)`}
											</Text>
										))}
										{polled.status === 'active' ? (
											<Pressable
												accessibilityRole="button"
												accessibilityLabel={`End poll ${polled.question}`}
												onPress={() => void handleEndPoll({
													pollId: polled.id,
													socket,
													showAlert,
													roomName,
													updateIsPollModalVisible,
												})}
												style={({ pressed }) => [
													styles.ghostButton,
													{
														borderColor: colors.danger,
														backgroundColor: pressed ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.08)',
													},
												]}
											>
												<Text style={[styles.ghostButtonText, { color: colors.danger }]}>End Poll</Text>
											</Pressable>
										) : null}
									</View>
								);
							})
						)}
					</View>
				) : null}

				{islevel === '2' ? (
					<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
						<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Composer</Text>
						<Text style={[styles.panelTitle, { color: colors.text }]}>Create a poll</Text>
						<TextInput
							style={[
								styles.textArea,
								{
									color: modalTheme.inputTextColor,
									borderColor: modalTheme.borderColor,
									backgroundColor: modalTheme.inputBackgroundColor,
								},
							]}
							multiline
							maxLength={300}
							value={newPoll.question}
							onChangeText={(text) => setNewPoll({ ...newPoll, question: text })}
							placeholder="Ask a question for the room"
							placeholderTextColor={modalTheme.placeholderTextColor}
						/>
						<RNPickerSelect
							onValueChange={handlePollTypeChange}
							items={[
								{ label: 'True / False', value: 'trueFalse' },
								{ label: 'Yes / No', value: 'yesNo' },
								{ label: 'Custom', value: 'custom' },
							]}
							placeholder={{ label: 'Choose answer type', value: '' }}
							style={pickerTheme}
							value={newPoll.type}
							useNativeAndroidPickerStyle={false}
						/>
						<View style={styles.createOptions}>{renderCreateOptions()}</View>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Create poll"
							onPress={() => void handleCreatePoll({
								poll: newPoll,
								socket,
								roomName,
								showAlert,
								updateIsPollModalVisible,
							})}
							style={({ pressed }) => [
								styles.primaryButton,
								{
									backgroundColor: pressed ? colors.accentAlt : colors.accent,
									borderColor: pressed ? colors.accentAlt : colors.accent,
								},
							]}
						>
							<Text style={[styles.primaryButtonText, { color: colors.invertedText }]}>Create Poll</Text>
						</Pressable>
					</View>
				) : null}

				<View style={[styles.panel, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					<View style={styles.currentPollHeader}>
						<View>
							<Text style={[styles.panelEyebrow, { color: colors.textMuted }]}>Live</Text>
							<Text style={[styles.panelTitle, { color: colors.text }]}>Current poll</Text>
						</View>
						{poll?.status === 'active' ? (
							<View style={[styles.badge, { backgroundColor: colors.accentSoft }]}> 
								<Text style={[styles.badgeText, { color: colors.accent }]}>Active</Text>
							</View>
						) : null}
					</View>

					{poll && poll.status === 'active' ? (
						<>
							<View style={[styles.questionCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}> 
								<Text style={[styles.pollQuestion, { color: colors.text }]}>{poll.question}</Text>
							</View>
							<View style={styles.voteOptions}>{renderCurrentPollOptions()}</View>
							{islevel === '2' ? (
								<Pressable
									accessibilityRole="button"
									accessibilityLabel="End current poll"
									onPress={() => void handleEndPoll({
										pollId: poll.id,
										socket,
										showAlert,
										roomName,
										updateIsPollModalVisible,
									})}
									style={({ pressed }) => [
										styles.ghostButton,
										{
											borderColor: colors.danger,
											backgroundColor: pressed ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.08)',
										},
									]}
								>
									<Text style={[styles.ghostButtonText, { color: colors.danger }]}>End Poll</Text>
								</Pressable>
							) : null}
						</>
					) : (
						<Text style={[styles.emptyStateText, { color: colors.textMuted }]}>No active poll.</Text>
					)}
				</View>
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
		<Modal animationType="fade" transparent visible={isPollModalVisible} onRequestClose={onClose}>
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
	emptyStateText: {
		fontSize: 13,
		lineHeight: 19,
		marginTop: 10,
	},
	pollCard: {
		borderWidth: 1,
		borderRadius: 14,
		padding: 14,
		gap: 8,
		marginTop: 12,
	} as any,
	pollQuestion: {
		fontSize: 14,
		fontWeight: '800',
		lineHeight: 20,
	},
	optionMeta: {
		fontSize: 12,
		lineHeight: 18,
	},
	textArea: {
		minHeight: 100,
		borderWidth: 1,
		borderRadius: 14,
		paddingHorizontal: 12,
		paddingVertical: 12,
		textAlignVertical: 'top',
		marginTop: 12,
		marginBottom: 12,
	},
	input: {
		minHeight: 44,
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		marginTop: 10,
	},
	createOptions: {
		marginTop: 4,
	},
	staticOptionRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 12,
		marginTop: 10,
	} as any,
	optionBullet: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	optionTitle: {
		fontSize: 14,
		fontWeight: '700',
	},
	primaryButton: {
		minHeight: 46,
		borderRadius: 14,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 14,
	},
	primaryButtonText: {
		fontSize: 14,
		fontWeight: '800',
	},
	currentPollHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	} as any,
	badge: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
	},
	badgeText: {
		fontSize: 11,
		fontWeight: '800',
	},
	questionCard: {
		borderWidth: 1,
		borderRadius: 14,
		padding: 14,
		marginTop: 12,
	},
	voteOptions: {
		marginTop: 12,
		gap: 10,
	} as any,
	voteOption: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		borderWidth: 1,
		borderRadius: 14,
		paddingHorizontal: 14,
		paddingVertical: 12,
	} as any,
	radioOuter: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	voteOptionCopy: {
		flex: 1,
		gap: 2,
	} as any,
	ghostButton: {
		minHeight: 42,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 12,
	},
	ghostButtonText: {
		fontSize: 13,
		fontWeight: '800',
	},
});

export default ModernPollModal;