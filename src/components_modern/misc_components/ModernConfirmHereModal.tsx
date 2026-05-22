import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
	useWindowDimensions,
} from 'react-native';
import type { ConfirmHereModalOptions } from '../../components/miscComponents/ConfirmHereModal';
import { getModernColors, getModernModalCardStyle, resolveIsDarkMode } from '../core/modernTheme';

export interface ModernConfirmHereModalProps extends ConfirmHereModalOptions {
	title?: string;
	message?: string;
	confirmLabel?: string;
}

export const ModernConfirmHereModal: React.FC<ModernConfirmHereModalProps> = ({
	isConfirmHereModalVisible,
	onConfirmHereClose,
	backgroundColor,
	isDarkMode,
	countdownDuration = 120,
	socket,
	localSocket,
	roomName,
	member,
	style,
	renderContent,
	renderContainer,
	title,
	message,
	confirmLabel,
}) => {
	const { width: windowWidth } = useWindowDimensions();
	const darkMode = resolveIsDarkMode({ isDarkMode, backgroundColor } as any);
	const colors = getModernColors(darkMode);
	const modalWidth = Math.min(Math.max(windowWidth * 0.82, 320), 460);
	const dimensions = { width: modalWidth, height: 0 };
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [counter, setCounter] = useState(countdownDuration);

	useEffect(() => {
		if (!isConfirmHereModalVisible) {
			setCounter(countdownDuration);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		setCounter(countdownDuration);
		intervalRef.current = setInterval(() => {
			setCounter((current) => {
				if (current <= 1) {
					if (intervalRef.current) {
						clearInterval(intervalRef.current);
						intervalRef.current = null;
					}

					socket.emit('disconnectUser', {
						member,
						roomName,
						ban: false,
					});

					try {
						if (localSocket?.id) {
							localSocket.emit('disconnectUser', {
								member,
								roomName,
								ban: false,
							});
						}
					} catch {
						// ignore local socket failures during timeout disconnect.
					}

					onConfirmHereClose();
					return 0;
				}

				return current - 1;
			});
		}, 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [
		countdownDuration,
		isConfirmHereModalVisible,
		localSocket,
		member,
		onConfirmHereClose,
		roomName,
		socket,
	]);

	if (!isConfirmHereModalVisible) {
		return null;
	}

	const handleConfirmHere = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setCounter(countdownDuration);
		onConfirmHereClose();
	};

	const contentBody = (
		<View style={styles.contentShell}>
			<View style={[styles.spinnerWrap, { backgroundColor: colors.accentSoft }]}> 
				<ActivityIndicator size="large" color={colors.accent} />
			</View>
			<Text style={[styles.titleText, { color: colors.text }]}>{title ?? 'Are you still there?'}</Text>
			<Text style={[styles.bodyText, { color: colors.textMuted }]}>{message ?? 'Please confirm your presence to stay connected to the room.'}</Text>
			<View style={[styles.counterBadge, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}> 
				<Text style={[styles.counterLabel, { color: colors.textMuted }]}>Time remaining</Text>
				<Text style={[styles.counterValue, { color: colors.text }]}>{counter}s</Text>
			</View>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={confirmLabel ?? "Yes, I'm here"}
				onPress={handleConfirmHere}
				style={({ pressed }) => [
					styles.primaryButton,
					{
						borderColor: pressed ? colors.accentAlt : colors.accent,
						backgroundColor: pressed ? colors.accentAlt : colors.accent,
					},
				]}
			>
				<Text style={[styles.primaryButtonText, { color: colors.invertedText }]}>{confirmLabel ?? "Yes, I'm here"}</Text>
			</Pressable>
		</View>
	);

	const content = renderContent ? renderContent({ defaultContent: contentBody, dimensions }) : contentBody;
	const shellStyle = [
		styles.modalShell,
		getModernModalCardStyle(darkMode),
		{ width: modalWidth, backgroundColor: backgroundColor ?? colors.surface },
		style,
	];

	const defaultContainer = (
		<Modal animationType="fade" transparent visible={isConfirmHereModalVisible} onRequestClose={onConfirmHereClose}>
			<View style={[styles.modalContainer, { backgroundColor: 'rgba(15, 23, 42, 0.32)' }]}>
				<View style={shellStyle}>{content}</View>
			</View>
		</Modal>
	);

	return renderContainer
		? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
		: defaultContainer;
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	modalShell: {
		overflow: 'hidden',
		paddingHorizontal: 22,
		paddingVertical: 24,
	},
	contentShell: {
		alignItems: 'center',
	},
	spinnerWrap: {
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
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
	counterBadge: {
		borderWidth: 1,
		borderRadius: 16,
		alignItems: 'center',
		paddingHorizontal: 18,
		paddingVertical: 12,
		marginTop: 18,
		minWidth: 150,
	},
	counterLabel: {
		fontSize: 12,
		fontWeight: '600',
	},
	counterValue: {
		fontSize: 24,
		fontWeight: '800',
		marginTop: 2,
	},
	primaryButton: {
		minHeight: 46,
		minWidth: 180,
		borderWidth: 1,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20,
	},
	primaryButtonText: {
		fontSize: 14,
		fontWeight: '800',
	},
});

export default ModernConfirmHereModal;