import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeartIconProps {
  filled: boolean;
  size?: number;
}

const HeartIcon: React.FC<HeartIconProps> = ({ filled, size = 24 }) => {
  return (
    <Ionicons
      name={filled ? 'heart' : 'heart-outline'}
      size={size}
      color={filled ? '#FF4B4B' : '#CCCCCC'}
    />
  );
};

export default HeartIcon;
