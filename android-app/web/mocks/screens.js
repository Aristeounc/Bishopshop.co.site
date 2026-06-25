import React from 'react';
import { View } from 'react-native';

export const enableScreens = () => {};
export const enableFreeze = () => {};

const createComponent = (name) => {
  const Component = ({ children, style, ...props }) =>
    React.createElement(View, { style: [{ flex: 1 }, style] }, children);
  Component.displayName = name;
  return Component;
};

export const Screen = createComponent('Screen');
export const ScreenContainer = createComponent('ScreenContainer');
export const ScreenStack = createComponent('ScreenStack');
export const ScreenStackHeaderConfig = createComponent('ScreenStackHeaderConfig');
export const NativeScreen = createComponent('NativeScreen');
export const NativeScreenContainer = createComponent('NativeScreenContainer');

export const screensEnabled = () => true;

export default {
  enableScreens,
  enableFreeze,
  Screen,
  ScreenContainer,
  ScreenStack,
  ScreenStackHeaderConfig,
  NativeScreen,
  NativeScreenContainer,
  screensEnabled,
};
