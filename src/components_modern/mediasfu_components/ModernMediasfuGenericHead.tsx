import React from 'react';

/** Published state contract produced by one MediaSFU room engine. */
export type ModernMediasfuGenericHeadParameters = Record<string, any> & {
  getCurrentParams?: () => ModernMediasfuGenericHeadParameters;
  renderModernMediasfuUI?: () => React.ReactElement;
};

export type ModernMediasfuGenericHeadOptions = {
  /** Latest parameter bag published by the existing headless room engine. */
  parameters: ModernMediasfuGenericHeadParameters;
};

/**
 * Renders the exact native standard UI owned by an existing room engine.
 * It never opens a socket, owns media, or calls the publishing getter.
 */
export const ModernMediasfuGenericHead: React.FC<
  ModernMediasfuGenericHeadOptions
> = ({ parameters }) => {
  const current = parameters.getCurrentParams?.() ?? parameters;
  const renderUI = current.renderModernMediasfuUI;

  return typeof renderUI === 'function' ? renderUI() : null;
};

export default ModernMediasfuGenericHead;
