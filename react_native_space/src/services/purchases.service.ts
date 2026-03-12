import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// Test Store key para testes sem Google Play Console
// Trocar para 'goog_ZdprNjnHgmlswNbOvVdIECFINaS' quando publicar na Play Store
const API_KEY_ANDROID = 'goog_ZdprNjnHgmlswNbOvVdIECFINaS';
const API_KEY_IOS = 'appl_placeholder';

class PurchasesService {
  private initialized = false;

  // Inicializar sem userId (antes do login)
  async initializeAnonymous(): Promise<void> {
    if (this.initialized) return;

    try {
      const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
      
      if (!apiKey) {
        console.warn('RevenueCat API key not configured for platform:', Platform.OS);
        return;
      }

      await Purchases.configure({ apiKey });
      this.initialized = true;
      console.log('✅ RevenueCat initialized anonymously');
    } catch (error) {
      console.warn('⚠️ Error initializing RevenueCat (esperado no Expo Go):', error);
    }
  }

  // Identificar usuário após login
  async identifyUser(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      console.log('✅ RevenueCat user identified:', userId);
    } catch (error) {
      console.error('❌ Error identifying user in RevenueCat:', error);
    }
  }

  // Manter método antigo para compatibilidade (deprecated)
  async initialize(userId: string): Promise<void> {
    await this.initializeAnonymous();
    if (userId) {
      await this.identifyUser(userId);
    }
  }

  async getOfferings(): Promise<PurchasesPackage[]> {
    try {
      // Ensure configured before calling — prevents "no singleton instance" crash
      if (!this.initialized) {
        await this.initializeAnonymous();
      }
      const offerings = await Purchases.getOfferings();
      
      if (offerings?.current?.availablePackages) {
        return offerings.current.availablePackages;
      }
      
      return [];
    } catch (error) {
      console.warn('⚠️ Error getting offerings (esperado no Expo Go):', error);
      return [];
    }
  }

  async purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      
      // Verificar se tem acesso ao entitlement 'premium'
      const isPremium = customerInfo?.entitlements?.active?.['premium']?.isActive ?? false;
      
      return isPremium;
    } catch (error: any) {
      if (error?.userCancelled) {
        console.log('User cancelled purchase');
      } else {
        console.error('Error purchasing package:', error);
      }
      return false;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      
      const isPremium = customerInfo?.entitlements?.active?.['premium']?.isActive ?? false;
      
      return isPremium;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      
      const isPremium = customerInfo?.entitlements?.active?.['premium']?.isActive ?? false;
      
      return isPremium;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await Purchases.logOut();
      this.initialized = false;
    } catch (error) {
      console.error('Error logging out from RevenueCat:', error);
    }
  }
}

export default new PurchasesService();
