import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  mode?: 'signin' | 'signup';
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  loading = false,
  mode = 'signin',
}) => {
  const text = mode === 'signin' ? 'Entrar com Google' : 'Cadastrar com Google';

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#666" size="small" />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
          </View>
          <Text style={styles.text}>{text}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C4043',
  },
});

export default GoogleSignInButton;
