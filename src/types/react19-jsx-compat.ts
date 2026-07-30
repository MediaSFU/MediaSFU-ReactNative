import type * as React from 'react';

// React 19 keeps JSX types under React.JSX; retain the legacy global names
// while the public API is migrated incrementally.
declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementType = React.JSX.ElementType;
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

export {};
