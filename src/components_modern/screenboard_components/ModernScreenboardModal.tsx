import React from 'react';
import {
	Modal,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
	useWindowDimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { getModernColors, getModernModalCardStyle, resolveIsDarkMode } from '../core/modernTheme';

export interface ModernScreenboardModalProps {
	isScreenboardModalVisible?: boolean;
	onScreenboardClose?: () => void;
	backgroundColor?: string;
	style?: StyleProp<ViewStyle>;
	parameters?: any;
	isDarkMode?: boolean;
	position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
	renderContainer?: (options: {
		defaultContainer: JSX.Element;
		dimensions: { width: number; height: number };
	}) => React.ReactNode;
}

export const ModernScreenboardModal: React.FC<ModernScreenboardModalProps> = ({
	isScreenboardModalVisible = false,
	onScreenboardClose,
	backgroundColor,
	style,
	isDarkMode,
	position = 'center',
	renderContainer,
}) => {
	const { width: windowWidth } = useWindowDimensions();
	const darkMode = resolveIsDarkMode({ isDarkMode, backgroundColor } as any);
	const colors = getModernColors(darkMode);
	const modalWidth = Math.min(Math.max(windowWidth * 0.82, 320), 440);
	const dimensions = { width: modalWidth, height: 240 };

	if (!isScreenboardModalVisible) {
		return null;
	}

	const alignmentStyle = position === 'center' ? styles.centeredContainer : getModalPosition({ position });
	const defaultContainer = (
		<Modal visible={isScreenboardModalVisible} transparent animationType="fade" onRequestClose={onScreenboardClose}>
			<Pressable onPress={onScreenboardClose} style={[styles.modalOverlay, alignmentStyle]}>
				<Pressable
					onPress={() => undefined}
					style={[
						styles.container,
						getModernModalCardStyle(darkMode),
						{ width: modalWidth, backgroundColor: backgroundColor ?? colors.surface },
						style,
					]}
				>
					<View style={[styles.iconBadge, { backgroundColor: colors.accentSoft }]}>
						<FontAwesome5 name="chalkboard" size={18} color={colors.accent} />
					</View>
					<Text style={[styles.title, { color: colors.text }]}>Screenboard</Text>
					<Text style={[styles.body, { color: colors.textMuted }]}>Screenboard is currently unsupported because native screen sharing is unavailable.</Text>
					<Pressable onPress={onScreenboardClose} style={[styles.button, { backgroundColor: colors.accent }]}>
						<Text style={[styles.buttonText, { color: colors.invertedText }]}>Close</Text>
					</Pressable>
				</Pressable>
			</Pressable>
		</Modal>
	);

	return renderContainer
		? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
		: defaultContainer;
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.45)',
		padding: 16,
	},
	centeredContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		minHeight: 240,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 22,
		paddingVertical: 24,
	},
	iconBadge: {
		width: 52,
		height: 52,
		borderRadius: 26,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
	},
	title: {
		fontSize: 20,
		fontWeight: '800',
		textAlign: 'center',
	},
	body: {
		fontSize: 14,
		lineHeight: 21,
		textAlign: 'center',
		marginTop: 10,
	},
	button: {
		marginTop: 20,
		minWidth: 140,
		minHeight: 44,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 14,
		fontWeight: '800',
	},
});

export default ModernScreenboardModal;
