import React from 'react';
import MediasfuGeneric, { MediasfuGenericOptions } from '../../components/mediasfuComponents/MediasfuGeneric';
import type { PreJoinPageOptions } from '../../components/miscComponents/PreJoinPage';
import type { WelcomePageOptions } from '../../components/miscComponents/WelcomePage';
import { ModernPreJoinPage } from '../misc_components/ModernPreJoinPage';
import { createModernReactNativeOverrides } from '../modernOverrides';

export interface ModernMediasfuGenericOptions extends MediasfuGenericOptions {
  useModernUI?: boolean;
}

const defaultModernPreJoinPage = (options: PreJoinPageOptions | WelcomePageOptions): React.ReactNode => (
  <ModernPreJoinPage {...(options as PreJoinPageOptions)} />
);

export const ModernMediasfuGeneric: React.FC<ModernMediasfuGenericOptions> = ({
  useModernUI = true,
  uiOverrides,
  PrejoinPage,
  ...props
}) => {
  const modernOverrides = React.useMemo(
    () => (useModernUI ? createModernReactNativeOverrides(uiOverrides) : uiOverrides),
    [uiOverrides, useModernUI]
  );

  return (
    <MediasfuGeneric
      {...props}
      PrejoinPage={PrejoinPage ?? defaultModernPreJoinPage}
      uiOverrides={modernOverrides}
    />
  );
};

export default ModernMediasfuGeneric;