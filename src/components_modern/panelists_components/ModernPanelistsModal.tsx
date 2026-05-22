import React from 'react';
import PanelistsModal, {
	type PanelistsModalOptions,
} from '../../components/panelistsComponents/PanelistsModal';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export interface ModernPanelistsModalProps extends PanelistsModalOptions {}

export const ModernPanelistsModal: React.FC<ModernPanelistsModalProps> = ({
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
		<PanelistsModal
			{...props}
			backgroundColor={backgroundColor ?? getModernColors(darkMode).surface}
			isDarkMode={darkMode}
			position={position}
			renderMode={renderMode}
		/>
	);
};

export default ModernPanelistsModal;