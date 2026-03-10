import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

interface SoundContextType {
  playSuccess: () => Promise<void>;
  playError: () => Promise<void>;
  playClick: () => Promise<void>;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [sounds, setSounds] = useState<{
    success: Sound | null;
    error: Sound | null;
    click: Sound | null;
  }>({
    success: null,
    error: null,
    click: null,
  });

  useEffect(() => {
    loadSounds();
    return () => {
      // Cleanup sounds on unmount
      unloadSounds();
    };
  }, []);

  const loadSounds = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Load success sound
      const { sound: successSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/success.mp3')
      );
      
      // Load error sound
      const { sound: errorSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/error.mp3')
      );
      
      // Load click sound
      const { sound: clickSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/click.mp3')
      );

      setSounds({
        success: successSound,
        error: errorSound,
        click: clickSound,
      });
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  };

  const unloadSounds = async () => {
    try {
      if (sounds.success) await sounds.success.unloadAsync();
      if (sounds.error) await sounds.error.unloadAsync();
      if (sounds.click) await sounds.click.unloadAsync();
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  };

  const playSuccess = async () => {
    if (!isSoundEnabled || !sounds.success) return;
    try {
      await sounds.success.replayAsync();
    } catch (error) {
      console.error('Error playing success sound:', error);
    }
  };

  const playError = async () => {
    if (!isSoundEnabled || !sounds.error) return;
    try {
      await sounds.error.replayAsync();
    } catch (error) {
      console.error('Error playing error sound:', error);
    }
  };

  const playClick = async () => {
    if (!isSoundEnabled || !sounds.click) return;
    try {
      await sounds.click.replayAsync();
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  return (
    <SoundContext.Provider
      value={{
        playSuccess,
        playError,
        playClick,
        isSoundEnabled,
        toggleSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
};
