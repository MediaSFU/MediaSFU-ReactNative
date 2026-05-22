import React from 'react';
import Pagination, { PaginationOptions } from '../../components/displayComponents/Pagination';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernPaginationOptions = PaginationOptions & { isDarkMode?: boolean };

export const ModernPagination: React.FC<ModernPaginationOptions> = (props) => {
  const colors = getModernColors(resolveIsDarkMode(props));

  return (
    <Pagination
      {...props}
      backgroundColor={props.backgroundColor ?? 'transparent'}
      activePageStyle={[
        {
          backgroundColor: colors.accent,
          borderRadius: 999,
        },
        props.activePageStyle,
      ] as any}
      inactivePageStyle={[
        {
          backgroundColor: colors.surface,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: colors.border,
        },
        props.inactivePageStyle,
      ] as any}
    />
  );
};

export default ModernPagination;