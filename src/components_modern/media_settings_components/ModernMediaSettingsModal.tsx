import React from 'react';
import MediaSettingsModal, {
	type MediaSettingsModalOptions,
} from '../../components/mediaSettingsComponents/MediaSettingsModal';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export interface ModernMediaSettingsModalProps extends MediaSettingsModalOptions {}

export const ModernMediaSettingsModal: React.FC<ModernMediaSettingsModalProps> = ({
	backgroundColor,
	isDarkMode,
	position = 'topRight',
	renderMode = 'modal',
	...props
}) => {
	const darkMode = resolveIsDarkMode({
		isDarkMode,
		backgroundColor,
		parameters: props.parameters,
	} as any);

	return (
		<MediaSettingsModal
			{...props}
			backgroundColor={backgroundColor ?? getModernColors(darkMode).surface}
			isDarkMode={darkMode}
			position={position}
			renderMode={renderMode}
		/>
	);
};

export default ModernMediaSettingsModal;