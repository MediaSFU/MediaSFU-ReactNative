import React from 'react';
import PermissionsModal, {
	type PermissionsModalOptions,
} from '../../components/permissionsComponents/PermissionsModal';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export interface ModernPermissionsModalProps extends PermissionsModalOptions {}

export const ModernPermissionsModal: React.FC<ModernPermissionsModalProps> = ({
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
		<PermissionsModal
			{...props}
			backgroundColor={backgroundColor ?? getModernColors(darkMode).surface}
			isDarkMode={darkMode}
			position={position}
			renderMode={renderMode}
		/>
	);
};

export default ModernPermissionsModal;