import React from 'react';
import ConfigureWhiteboardModal from '../../components/whiteboardComponents/ConfigureWhiteboardModal';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernConfigureWhiteboardModalProps = React.ComponentProps<typeof ConfigureWhiteboardModal>;

export const ModernConfigureWhiteboardModal: React.FC<ModernConfigureWhiteboardModalProps> = ({
	backgroundColor,
	isDarkMode,
	position = 'center',
	renderMode = 'modal',
	...props
}) => {
	const darkMode = resolveIsDarkMode({
		isDarkMode,
		backgroundColor,
		parameters: props.parameters,
	} as any);

	return (
		<ConfigureWhiteboardModal
			{...props}
			backgroundColor={backgroundColor ?? getModernColors(darkMode).surface}
			isDarkMode={darkMode}
			position={position}
			renderMode={renderMode}
		/>
	);
};

export default ModernConfigureWhiteboardModal;