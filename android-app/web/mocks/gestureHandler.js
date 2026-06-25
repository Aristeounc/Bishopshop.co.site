import React from 'react';
import { View, ScrollView as RNScrollView, FlatList as RNFlatList } from 'react-native';

const createComponent = (name) => {
  const Component = React.forwardRef(({ children, style, ...props }, ref) =>
    React.createElement(View, { style, ref, ...props }, children));
  Component.displayName = name;
  return Component;
};

export const GestureHandlerRootView = ({ children, style }) =>
  React.createElement(View, { style: [{ flex: 1 }, style] }, children);

export const Swipeable = createComponent('Swipeable');
export const DrawerLayout = createComponent('DrawerLayout');

export const State = {};
export const PanGestureHandler = createComponent('PanGestureHandler');
export const TapGestureHandler = createComponent('TapGestureHandler');
export const FlingGestureHandler = createComponent('FlingGestureHandler');
export const ForceTouchGestureHandler = createComponent('ForceTouchGestureHandler');
export const LongPressGestureHandler = createComponent('LongPressGestureHandler');
export const PinchGestureHandler = createComponent('PinchGestureHandler');
export const RotationGestureHandler = createComponent('RotationGestureHandler');
export const NativeViewGestureHandler = createComponent('NativeViewGestureHandler');
export const gestureHandlerRootHOC = (Component) => Component;

export const ScrollView = RNScrollView;
export const FlatList = RNFlatList;
export const TouchableHighlight = createComponent('TouchableHighlight');
export const TouchableNativeFeedback = createComponent('TouchableNativeFeedback');
export const TouchableOpacity = createComponent('TouchableOpacity');
export const TouchableWithoutFeedback = createComponent('TouchableWithoutFeedback');
export const RectButton = createComponent('RectButton');
export const BorderlessButton = createComponent('BorderlessButton');
export const BaseButton = createComponent('BaseButton');

export const Directions = {};

export default {
  GestureHandlerRootView,
  Swipeable,
  DrawerLayout,
  State,
  PanGestureHandler,
  TapGestureHandler,
  gestureHandlerRootHOC,
  ScrollView: RNScrollView,
  FlatList: RNFlatList,
};
