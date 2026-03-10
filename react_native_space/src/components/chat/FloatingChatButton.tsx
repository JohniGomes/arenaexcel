import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import { useChat } from '../../contexts/ChatContext';
import { theme } from '../../constants/theme';

const FloatingChatButton: React.FC = () => {
  const { openChat } = useChat();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={openChat}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Image
          source={require('../../../assets/excelino-welcome.gif')}
          style={styles.mascot}
          resizeMode="contain"
        />
      </View>
      <View style={styles.badge}>
        <Image
          source={require('../../../assets/excelino-welcome.gif')}
          style={styles.badgeMascot}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mascot: {
    width: 45,
    height: 45,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeMascot: {
    width: 14,
    height: 14,
  },
});

export default FloatingChatButton;
