import React from 'react';
import { View } from 'react-native';

const LinearGradient = ({ children, style, colors, ...props }) =>
  React.createElement(View, {
    style: [style, { backgroundColor: colors?.[0] || '#000' }],
    ...props,
  }, children);

export default LinearGradient;
module.exports = LinearGradient;
module.exports.default = LinearGradient;
