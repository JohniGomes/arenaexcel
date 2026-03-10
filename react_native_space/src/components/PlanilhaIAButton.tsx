import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, Image, View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import PlanilhaIAScreen from '../screens/main/PlanilhaIAScreen';
import { theme } from '../constants/theme';

const PlanilhaIAButton = () => {
  const { user } = useAuth();
  const [aberto, setAberto] = useState(false);
  const isPremium = (user as any)?.isPremium ?? false;

  if (!isPremium) return null;

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setAberto(true)} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <Image 
            source={require('../../assets/excelino-welcome.gif')} 
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PRÓ</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={aberto} animationType="slide" onRequestClose={() => setAberto(false)}>
        <PlanilhaIAScreen onClose={() => setAberto(false)} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 90, // Posicionado à esquerda do botão de chat normal
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F59E0B', // Dourado
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 998,
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
    width: 32,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F59E0B', // Dourado
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
});

export default PlanilhaIAButton;
