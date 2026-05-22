import React from 'react';

/**
 * Custom component override type
 * Allows replacing default components with custom implementations
 */
export type CustomComponentOverride<P = any> =
  | React.ComponentType<P>
  | {
      component?: React.ComponentType<P>;
      render?: (props: P) => React.ReactNode;
    };

/**
 * Custom function override type
 * Allows replacing default functions with custom implementations
 */
export type CustomFunctionOverride<F extends (...args: any[]) => any> =
  | F
  | {
      implementation?: F;
      wrap?: (defaultImplementation: F) => F;
    };

/**
 * Helper function to apply component overrides
 * Returns the override component if provided, otherwise returns the default component
 *
 * @param override - Optional custom component to use instead of default
 * @param defaultComponent - The default component to use if no override is provided
 * @returns The component to render (either override or default)
 */
export function withOverride<P = any>(
  override: CustomComponentOverride<P> | undefined,
  defaultComponent: React.ComponentType<P>,
): React.ComponentType<P> {
  if (!override) {
    return defaultComponent;
  }

  if (typeof override === 'function') {
    return override;
  }

  if (override.component) {
    return override.component;
  }

  if (override.render) {
    return ((props: P) => override.render!(props)) as React.ComponentType<P>;
  }

  return defaultComponent;
}

/**
 * Helper function to apply function overrides
 * Returns the override function if provided, otherwise returns the default function
 *
 * @param override - Optional custom function to use instead of default
 * @param defaultFunction - The default function to use if no override is provided
 * @returns The function to use (either override or default)
 */
export function withFunctionOverride<F extends (...args: any[]) => any>(
  override: CustomFunctionOverride<F> | undefined,
  defaultFunction: F,
): F {
  if (!override) {
    return defaultFunction;
  }

  if (typeof override === 'function') {
    return override;
  }

  if (override.implementation) {
    return override.implementation;
  }

  if (override.wrap) {
    return override.wrap(defaultFunction);
  }

  return defaultFunction;
}
