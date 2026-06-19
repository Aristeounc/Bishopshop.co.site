import React from 'react';
import { View } from 'react-native';

const createComponent = (name) => {
  const Component = ({ children, style, ...props }) =>
    React.createElement(View, { style, ...props }, children);
  Component.displayName = name;
  return Component;
};

export const Svg = createComponent('Svg');
export const Circle = createComponent('Circle');
export const Rect = createComponent('Rect');
export const Path = createComponent('Path');
export const G = createComponent('G');
export const Text = createComponent('SvgText');
export const Line = createComponent('Line');
export const Defs = createComponent('Defs');
export const LinearGradient = createComponent('LinearGradient');
export const Stop = createComponent('Stop');

export default Svg;
