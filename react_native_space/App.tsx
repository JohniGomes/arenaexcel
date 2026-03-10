import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { SnackbarProvider } from './src/contexts/SnackbarContext';
import { SoundProvider } from './src/contexts/SoundContext';
import { ChatProvider } from './src/contexts/ChatContext';
import RootNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { theme } from './src/constants/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <PaperProvider theme={theme}>
          <SoundProvider>
            <AuthProvider>
              <ChatProvider>
                <SnackbarProvider>
                  <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
                  <RootNavigator />
                </SnackbarProvider>
              </ChatProvider>
            </AuthProvider>
          </SoundProvider>
        </PaperProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
