import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useChat } from '../../contexts/ChatContext';
import { usePremium } from '../../hooks/usePremium';
import PaywallModal from '../PaywallModal';
import { theme } from '../../constants/theme';
import Button from '../Button';

const ChatModal: React.FC = () => {
  const { messages, isLoading, isChatOpen, closeChat, sendMessage, clearMessages } = useChat();
  const { isPremium } = usePremium();
  const [inputText, setInputText] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const verificarLimiteChat = async (): Promise<boolean> => {
    if (isPremium) return true;

    const hoje = new Date().toDateString();
    const chave = `chat_msgs_${hoje}`;
    const contagem = parseInt((await AsyncStorage.getItem(chave)) ?? '0');

    if (contagem >= 10) {
      Alert.alert(
        '💬 Limite diário atingido',
        'Você usou suas 10 mensagens gratuitas de hoje. Seja Premium para chat ilimitado!',
        [
          { text: 'Agora não', style: 'cancel' },
          { text: '⭐ Ver Premium', onPress: () => setShowPaywall(true) },
        ]
      );
      return false;
    }

    await AsyncStorage.setItem(chave, String(contagem + 1));
    return true;
  };

  const handleSend = async () => {
    if (!inputText?.trim() || isLoading) return;

    // Verificar limite antes de enviar
    const permitido = await verificarLimiteChat();
    if (!permitido) return;
    
    const message = inputText;
    setInputText('');
    await sendMessage(message);
  };

  return (
    <>
    <Modal
      visible={isChatOpen}
      animationType="slide"
      onRequestClose={closeChat}
      statusBarTranslucent={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../../assets/excelino-welcome.gif')}
              style={styles.headerMascot}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.headerTitle}>Pergunte ao Excelino</Text>
              <Text style={styles.headerSubtitle}>Especialista em Excel 📊</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={clearMessages} 
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="refresh-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={closeChat} 
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd({ animated: true })}
        >
          {messages?.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message?.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              {message?.role === 'assistant' && (
                <Image
                  source={require('../../../assets/excelino-welcome.gif')}
                  style={styles.messageMascot}
                  resizeMode="contain"
                />
              )}
              <View
                style={[
                  styles.messageContent,
                  message?.role === 'user' ? styles.userContent : styles.assistantContent,
                ]}
              >
                {message?.role === 'user' ? (
                  <Text
                    style={[
                      styles.messageText,
                      styles.userText,
                    ]}
                  >
                    {message?.content}
                  </Text>
                ) : (
                  <Markdown
                    style={{
                      body: styles.assistantText,
                      heading1: styles.markdownHeading1,
                      heading2: styles.markdownHeading2,
                      heading3: styles.markdownHeading3,
                      strong: styles.markdownStrong,
                      em: styles.markdownEm,
                      code_inline: styles.markdownCodeInline,
                      code_block: styles.markdownCodeBlock,
                      fence: styles.markdownCodeBlock,
                      list_item: styles.markdownListItem,
                    }}
                  >
                    {message?.content ?? ''}
                  </Markdown>
                )}
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <Image
                source={require('../../../assets/excelino-thinking.gif')}
                style={styles.messageMascot}
                resizeMode="contain"
              />
              <View style={[styles.messageContent, styles.assistantContent]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Excelino está pensando...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua dúvida sobre Excel..."
              mode="outlined"
              style={styles.input}
              multiline
              maxLength={500}
              disabled={isLoading}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText?.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText?.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={24}
                color={!inputText?.trim() || isLoading ? theme.colors.textSecondary : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
    
    <PaywallModal
      visivel={showPaywall}
      onFechar={() => setShowPaywall(false)}
      onSuccess={() => setShowPaywall(false)}
    />
  </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    minHeight: 70,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerMascot: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  messageMascot: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  messageContent: {
    borderRadius: 16,
    padding: 12,
    flex: 1,
  },
  userContent: {
    backgroundColor: theme.colors.primary,
  },
  assistantContent: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: theme.colors.text,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Markdown styles
  markdownHeading1: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  markdownHeading2: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 10,
    marginBottom: 6,
  },
  markdownHeading3: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  markdownStrong: {
    fontWeight: '700',
    color: theme.colors.text,
  },
  markdownEm: {
    fontStyle: 'italic',
    color: theme.colors.text,
  },
  markdownCodeInline: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#f5f5f5',
    color: '#e74c3c',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 14,
  },
  markdownCodeBlock: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#f5f5f5',
    color: '#2c3e50',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
    fontSize: 13,
    lineHeight: 20,
  },
  markdownListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
});

export default ChatModal;
