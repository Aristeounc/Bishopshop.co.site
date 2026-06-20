import React from 'react';
import { Text } from 'react-native';

const ICON_MAP = {
  'home-outline': '⌂',
  'chart-line': '↗',
  'calendar-check-outline': '☑',
  'sword-cross': '⚔',
  'trophy-outline': '☆',
  'cog-outline': '⚙',
  'eye-outline': '◉',
  'magnify': '⌕',
  'translate': '⩮',
  'fire': '⭐',
  'crystal-ball': '◎',
  'shield-check-outline': '☶',
  'brain': '☉',
  'heart-outline': '♡',
  'handshake-outline': '☹',
  'ear-hearing': '♂',
  'bullhorn-outline': '⚐',
  'scale-balance': '⚖',
  'account-heart-outline': '♥',
  'check-circle': '✔',
  'close': '✖',
  'arrow-left': '←',
  'chevron-right': '›',
  'chevron-down': '⌄',
  'chevron-up': '⌃',
  'dumbbell': '⚔',
  'meditation': '☉',
  'alert-circle-outline': '⚠',
  'information-outline': 'ℹ',
  'star': '★',
  'star-outline': '☆',
  'lock-outline': '⚿',
};

function Icon({ name, size = 24, color = '#FFF', style }) {
  return React.createElement(Text, {
    style: [{ fontSize: size, color, fontFamily: 'monospace', textAlign: 'center' }, style],
  }, ICON_MAP[name] || '□');
}

Icon.getImageSource = () => Promise.resolve({ uri: '' });
Icon.getImageSourceSync = () => ({ uri: '' });
Icon.loadFont = () => Promise.resolve();
Icon.hasIcon = () => true;

export default Icon;
module.exports = Icon;
module.exports.default = Icon;
