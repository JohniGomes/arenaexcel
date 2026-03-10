import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../types/api.types';
import ApiService from '../services/api.service';
import { usePremium } from '../hooks/usePremium';

interface ChatContextData {
  messages: ChatMessage[];
  isLoading: boolean;
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string, onShowPaywall?: () => void) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Eu sou o Excelino! 🐾\n\nEstou aqui para te ajudar com qualquer dúvida sobre Excel. Pode me perguntar sobre fórmulas, funções, atalhos, gráficos e muito mais! 📊\n\nComo posso te ajudar hoje?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const sendMessage = async (message: string) => {
    if (!message?.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get history (last 10 messages for context, excluding welcome message)
      const history = messages
        .slice(1) // Skip welcome message
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Call API (only include history if not empty)
      const response = await ApiService.sendChatMessage({
        message: message.trim(),
        ...(history.length > 0 && { history }),
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response?.response ?? 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      console.error('Error details:', error?.response?.data || error?.message);
      
      // Add error message with more context
      let errorText = 'Desculpe, ocorreu um erro ao processar sua mensagem.';
      
      if (error?.response?.status === 400) {
        errorText = 'Ocorreu um erro ao validar sua mensagem. Por favor, tente novamente.';
      } else if (error?.response?.status === 401) {
        errorText = 'Sua sessão expirou. Por favor, faça login novamente.';
      } else if (error?.response?.status === 500) {
        errorText = 'Erro no servidor. Por favor, tente novamente em alguns instantes.';
      }
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: errorText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Olá! Eu sou o Excelino! 🐾\n\nEstou aqui para te ajudar com qualquer dúvida sobre Excel. Pode me perguntar sobre fórmulas, funções, atalhos, gráficos e muito mais! 📊\n\nComo posso te ajudar hoje?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        isChatOpen,
        openChat,
        closeChat,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
