import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	View,
	useWindowDimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import type {
	CoHostModalOptions,
} from '../../components/coHostComponents/CoHostModal';
import { modifyCoHostSettings } from '../../methods/coHostMethods/modifyCoHostSettings';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { createThemedPickerSelectStyles } from '../core/modalBodyTheme';
import {
	getModernColors,
	getModernModalCardStyle,
	getModernSidePanelStyle,
	resolveIsDarkMode,
} from '../core/modernTheme';

type ModernCoHostRenderMode = 'modal' | 'sidebar' | 'inline';

export interface ModernCoHostModalProps extends CoHostModalOptions {
	renderMode?: ModernCoHostRenderMode;
}

type LocalResponsibility = {
	name: string;
	value: boolean;
	dedicated: boolean;
};

const formatResponsibilityLabel = (name: string) => (
	name
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (value) => value.toUpperCase())
		.trim()
);

export const ModernCoHostModal: React.FC<ModernCoHostModalProps> = ({
	isCoHostModalVisible,
	onCoHostClose,
	onModifyEventSettings = modifyCoHostSettings,
	currentCohost = 'No coHost',
	participants,
	coHostResponsibility,
	position = 'topRight',
	backgroundColor,
	isDarkMode,
	roomName,
	showAlert,
	updateCoHostResponsibility,
	updateCoHost,
	updateIsCoHostModalVisible,
	socket,
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
	const modalHeight = Math.min(Math.max(windowHeight * 0.72, 440), 720);
	const dimensions = { width: modalWidth, height: modalHeight };

	const [selectedCohost, setSelectedCohost] = useState(currentCohost);
	const [responsibilities, setResponsibilities] = useState<LocalResponsibility[]>(coHostResponsibility.map((item) => ({ ...item })));

	useEffect(() => {
		if (!isCoHostModalVisible && !isEmbedded) {
			return;
		}

		setSelectedCohost(currentCohost);
		setResponsibilities(coHostResponsibility.map((item) => ({ ...item })));
	}, [coHostResponsibility, currentCohost, isCoHostModalVisible, isEmbedded]);

	const eligibleParticipants = useMemo(
		() => participants.filter((participant) => participant.name !== currentCohost && participant.islevel !== '2'),
		[currentCohost, participants],
	);

	const pickerTheme = useMemo(
		() => createThemedPickerSelectStyles({
			textColor: colors.text,
			mutedTextColor: colors.textMuted,
			inputTextColor: colors.text,
			placeholderTextColor: colors.textMuted,
			inputBackgroundColor: colors.surfaceStrong,
			borderColor: colors.border,
			dividerColor: colors.border,
			rowBackgroundColor: colors.surfaceMuted,
			badgeBackgroundColor: colors.accentSoft,
			badgeTextColor: colors.accent,
			iconColor: colors.textMuted,
			successColor: colors.success,
			dangerColor: colors.danger,
			buttonBackgroundColor: colors.accent,
			buttonTextColor: colors.invertedText,
			accentColor: colors.accent,
		}),
		[colors],
	);

	const toggleResponsibility = useCallback((name: string, field: 'value' | 'dedicated') => {
		setResponsibilities((currentItems) => currentItems.map((item) => {
			if (item.name !== name) {
				return item;
			}

			if (field === 'value') {
				const nextValue = !item.value;
				return {
					...item,
					value: nextValue,
					dedicated: nextValue ? item.dedicated : false,
				};
			}

			if (!item.value) {
				return item;
			}

			return {
				...item,
				dedicated: !item.dedicated,
			};
		}));
	}, []);

	const handleSave = useCallback(() => {
		onModifyEventSettings({
			roomName,
			showAlert,
			selectedParticipant: selectedCohost,
			coHost: currentCohost,
			coHostResponsibility: responsibilities,
			updateCoHostResponsibility,
			updateCoHost,
			updateIsCoHostModalVisible,
			socket,
		});

		onCoHostClose();
	}, [
		currentCohost,
		onCoHostClose,
		onModifyEventSettings,
		responsibilities,
		roomName,
		selectedCohost,
		showAlert,
		socket,
		updateCoHost,
		updateCoHostResponsibility,
		updateIsCoHostModalVisible,
	]);

	if (!isEmbedded && !isCoHostModalVisible) {
		return null;
	}

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}>
				<View style={styles.titleRow}>
					<View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}>
						<FontAwesome name="user-secret" size={16} color={colors.accent} />
					</View>
					<View>
						<Text style={[styles.titleText, { color: colors.text }]}>Co-host settings</Text>
						<Text style={[styles.subtitleText, { color: colors.textMuted }]}>Assign a co-host and define their room responsibilities</Text>
					</View>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close co-host settings"
					onPress={onCoHostClose}
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

			<ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
				<View style={[styles.fieldCard, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					<Text style={[styles.fieldLabel, { color: colors.text }]}>Current co-host</Text>
					<TextInput
						editable={false}
						style={[
							styles.readOnlyInput,
							{
								backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.72)' : 'rgba(226, 232, 240, 0.72)',
								borderColor: colors.border,
								color: colors.text,
							},
						]}
						value={currentCohost}
					/>
				</View>

				<View style={[styles.fieldCard, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					<Text style={[styles.fieldLabel, { color: colors.text }]}>Select new co-host</Text>
					<RNPickerSelect
						style={pickerTheme}
						value={selectedCohost}
						onValueChange={(value: string) => setSelectedCohost(value)}
						items={eligibleParticipants.map((participant) => ({
							label: participant.name,
							value: participant.name,
						}))}
						placeholder={{ label: 'Select a participant', value: '' }}
						useNativeAndroidPickerStyle={false}
					/>
				</View>

				<View style={[styles.responsibilityCard, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}> 
					<View style={styles.responsibilityHeader}>
						<Text style={[styles.responsibilityTitle, { color: colors.text }]}>Responsibilities</Text>
						<Text style={[styles.responsibilityCopy, { color: colors.textMuted }]}>Toggle access and whether each area is dedicated to the co-host.</Text>
					</View>

					<View style={[styles.responsibilityTableHeader, { borderBottomColor: colors.border }]}> 
						<Text style={[styles.tableHeaderLabel, styles.tableHeaderName, { color: colors.textMuted }]}>Area</Text>
						<Text style={[styles.tableHeaderLabel, styles.tableHeaderToggle, { color: colors.textMuted }]}>Enable</Text>
						<Text style={[styles.tableHeaderLabel, styles.tableHeaderToggle, { color: colors.textMuted }]}>Dedicated</Text>
					</View>

					{responsibilities.length === 0 ? (
						<View style={styles.emptyState}>
							<View style={[styles.emptyStateIcon, { backgroundColor: colors.accentSoft }]}>
								<FontAwesome name="shield" size={18} color={colors.accent} />
							</View>
							<Text style={[styles.emptyStateTitle, { color: colors.text }]}>No co-host responsibilities configured</Text>
							<Text style={[styles.emptyStateBody, { color: colors.textMuted }]}>This room has not exposed responsibility settings yet.</Text>
						</View>
					) : (
						responsibilities.map((item) => (
							<View key={item.name} style={[styles.responsibilityRow, { borderBottomColor: colors.border }]}> 
								<View style={styles.responsibilityNameWrap}>
									<Text style={[styles.responsibilityName, { color: colors.text }]}>{formatResponsibilityLabel(item.name)}</Text>
								</View>
								<View style={styles.responsibilityToggleWrap}>
									<Switch
										trackColor={{ false: colors.surfaceMuted, true: colors.accentSoft }}
										thumbColor={item.value ? colors.accent : colors.textMuted}
										ios_backgroundColor={colors.surfaceMuted}
										onValueChange={() => toggleResponsibility(item.name, 'value')}
										value={item.value}
									/>
								</View>
								<View style={styles.responsibilityToggleWrap}>
									<Switch
										trackColor={{ false: colors.surfaceMuted, true: colors.accentSoft }}
										thumbColor={item.value && item.dedicated ? colors.success : colors.textMuted}
										ios_backgroundColor={colors.surfaceMuted}
										onValueChange={() => toggleResponsibility(item.name, 'dedicated')}
										value={item.value && item.dedicated}
										disabled={!item.value}
									/>
								</View>
							</View>
						))
					)}
				</View>

				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Save co-host settings"
					onPress={handleSave}
					style={({ pressed }) => [
						styles.saveButton,
						{
							backgroundColor: pressed ? colors.accentAlt : colors.accent,
						},
					]}
				>
					<FontAwesome name="check" size={14} color={colors.invertedText} />
					<Text style={[styles.saveButtonText, { color: colors.invertedText }]}>Save co-host settings</Text>
				</Pressable>
			</ScrollView>
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
		<Modal transparent animationType="slide" visible={isCoHostModalVisible} onRequestClose={onCoHostClose}>
			<Pressable onPress={onCoHostClose} style={overlayStyle}>
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
	iconButton: {
		width: 38,
		height: 38,
		borderRadius: 19,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	body: {
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 20,
	},
	fieldCard: {
		borderWidth: 1,
		borderRadius: 18,
		padding: 14,
		marginBottom: 14,
	},
	fieldLabel: {
		fontSize: 13,
		fontWeight: '700',
		marginBottom: 10,
	},
	readOnlyInput: {
		borderWidth: 1,
		borderRadius: 14,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 14,
	},
	responsibilityCard: {
		borderWidth: 1,
		borderRadius: 22,
		paddingHorizontal: 14,
		paddingVertical: 14,
		marginBottom: 16,
	},
	responsibilityHeader: {
		marginBottom: 12,
	},
	responsibilityTitle: {
		fontSize: 15,
		fontWeight: '700',
	},
	responsibilityCopy: {
		fontSize: 12,
		marginTop: 4,
		lineHeight: 18,
	},
	responsibilityTableHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		paddingBottom: 8,
		marginBottom: 4,
	},
	tableHeaderLabel: {
		fontSize: 11,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.4,
	},
	tableHeaderName: {
		flex: 1,
	},
	tableHeaderToggle: {
		width: 80,
		textAlign: 'center',
	},
	responsibilityRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 1,
	},
	responsibilityNameWrap: {
		flex: 1,
		paddingRight: 12,
	},
	responsibilityName: {
		fontSize: 14,
		fontWeight: '600',
	},
	responsibilityToggleWrap: {
		width: 80,
		alignItems: 'center',
	},
	saveButton: {
		height: 48,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	saveButtonText: {
		fontSize: 14,
		fontWeight: '700',
		marginLeft: 8,
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 28,
		paddingVertical: 18,
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

export default ModernCoHostModal;