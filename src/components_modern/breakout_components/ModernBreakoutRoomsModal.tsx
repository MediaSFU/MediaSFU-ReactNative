import React from 'react';
import BreakoutRoomsModal, {
	type BreakoutRoomsModalOptions,
} from '../../components/breakoutComponents/BreakoutRoomsModal';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export interface ModernBreakoutRoomsModalProps extends BreakoutRoomsModalOptions {}

export const ModernBreakoutRoomsModal: React.FC<ModernBreakoutRoomsModalProps> = ({
	backgroundColor,
	isDarkMode,
	position = 'topRight',
	...props
}) => {
	const darkMode = resolveIsDarkMode({
		isDarkMode,
		backgroundColor,
		parameters: props.parameters,
	} as any);

	return (
		<BreakoutRoomsModal
			{...props}
			backgroundColor={backgroundColor ?? getModernColors(darkMode).surface}
			isDarkMode={darkMode}
			position={position}
		/>
	);
};

export default ModernBreakoutRoomsModal;