import React from 'react';
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
	useWindowDimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import type { ConfirmExitModalOptions } from '../../components/exitComponents/ConfirmExitModal';
import { confirmExit } from '../../methods/exitMethods/confirmExit';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { getModernColors, getModernModalCardStyle, resolveIsDarkMode } from '../core/modernTheme';

type ModernConfirmExitPosition = 'center' | 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

export interface ModernConfirmExitModalProps extends Omit<ConfirmExitModalOptions, 'position'> {
	position?: ModernConfirmExitPosition;
	title?: string;
	message?: string;
	confirmLabel?: string;
	cancelLabel?: string;
}

export const ModernConfirmExitModal: React.FC<ModernConfirmExitModalProps> = ({
	isConfirmExitModalVisible,
	onConfirmExitClose,
	position = 'center',
	backgroundColor,
	isDarkMode,
	exitEventOnConfirm = confirmExit,
	member,
	ban = false,
	roomName,
	socket,
	islevel,
	style,
	renderContent,
	renderContainer,
	title,
	message,
	confirmLabel,
	cancelLabel,
}) => {
	const { width: windowWidth } = useWindowDimensions();
	const darkMode = resolveIsDarkMode({ isDarkMode, backgroundColor } as any);
	const colors = getModernColors(darkMode);
	const modalWidth = Math.min(Math.max(windowWidth * 0.82, 320), 420);
	const dimensions = { width: modalWidth, height: 0 };

	if (!isConfirmExitModalVisible) {
		return null;
	}

	const resolvedTitle = title ?? (islevel === '2' ? 'End Event' : ban ? 'Remove Participant' : 'Confirm Exit');
	const resolvedMessage = message
		?? (islevel === '2'
			? 'This ends the event for everyone currently in the room.'
			: ban
				? 'This removes the participant from the room.'
				: 'Are you sure you want to leave this event?');
	const resolvedConfirmLabel = confirmLabel ?? (islevel === '2' ? 'End Event' : ban ? 'Remove' : 'Exit');
	const resolvedCancelLabel = cancelLabel ?? 'Cancel';

	const handleConfirmExit = () => {
		exitEventOnConfirm({
			socket,
			member,
			roomName,
			ban,
		});
		onConfirmExitClose();
	};

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={styles.iconWrap}>
				<View style={[styles.iconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}> 
					<FontAwesome5 name={islevel === '2' ? 'power-off' : 'sign-out-alt'} size={18} color={colors.danger} />
				</View>
			</View>
			<Text style={[styles.titleText, { color: colors.text }]}>{resolvedTitle}</Text>
			<Text style={[styles.bodyText, { color: colors.textMuted }]}>{resolvedMessage}</Text>
			<View style={styles.buttonRow}>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel={resolvedCancelLabel}
					onPress={onConfirmExitClose}
					style={({ pressed }) => [
						styles.secondaryButton,
						{
							borderColor: colors.border,
							backgroundColor: pressed ? colors.surfaceMuted : colors.surfaceStrong,
						},
					]}
				>
					<Text style={[styles.secondaryButtonText, { color: colors.text }]}>{resolvedCancelLabel}</Text>
				</Pressable>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel={resolvedConfirmLabel}
					onPress={handleConfirmExit}
					style={({ pressed }) => [
						styles.primaryButton,
						{
							borderColor: pressed ? colors.warning : colors.danger,
							backgroundColor: pressed ? colors.warning : colors.danger,
						},
					]}
				>
					<Text style={[styles.primaryButtonText, { color: colors.invertedText }]}>{resolvedConfirmLabel}</Text>
				</Pressable>
			</View>
		</View>
	);

	const content = renderContent ? renderContent({ defaultContent: contentBody, dimensions }) : contentBody;
	const alignmentStyle = position === 'center' ? styles.centeredContainer : getModalPosition({ position });
	const shellStyle = [
		styles.modalShell,
		getModernModalCardStyle(darkMode),
		{ width: modalWidth, backgroundColor: backgroundColor ?? colors.surface },
		style,
	];

	const defaultContainer = (
		<Modal animationType="fade" transparent visible={isConfirmExitModalVisible} onRequestClose={onConfirmExitClose}>
			<Pressable onPress={onConfirmExitClose} style={[styles.modalContainer, alignmentStyle, { backgroundColor: 'rgba(15, 23, 42, 0.28)' }]}>
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
		padding: 16,
	},
	centeredContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalShell: {
		overflow: 'hidden',
		paddingHorizontal: 20,
		paddingVertical: 22,
	},
	contentShell: {
		alignItems: 'center',
	},
	iconWrap: {
		marginBottom: 12,
	},
	iconBadge: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		fontSize: 20,
		fontWeight: '800',
		textAlign: 'center',
	},
	bodyText: {
		fontSize: 14,
		lineHeight: 21,
		textAlign: 'center',
		marginTop: 10,
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 22,
		width: '100%',
	} as any,
	secondaryButton: {
		flex: 1,
		minHeight: 44,
		borderWidth: 1,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryButtonText: {
		fontSize: 14,
		fontWeight: '700',
	},
	primaryButton: {
		flex: 1,
		minHeight: 44,
		borderWidth: 1,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButtonText: {
		fontSize: 14,
		fontWeight: '800',
	},
});

export default ModernConfirmExitModal;