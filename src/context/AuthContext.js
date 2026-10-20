import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

export const AuthContext = createContext();

const TOKEN_KEY = '@user_demo_token';
const BIOMETRIC_ENABLED_KEY = '@biometric_login_enabled';
const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [biometricError, setBiometricError] = useState(null);

  const verifyBiometrics = async () => {
    try {
      const { available, error } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        return {
          success: false,
          error: error || 'Face ID, Touch ID, or a device passcode is not available.',
        };
      }

      return await rnBiometrics.simplePrompt({
        promptMessage: 'Unlock TestingAppIOS',
        fallbackPromptMessage: 'Use device passcode',
      });
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Unable to verify your identity.',
      };
    }
  };

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const [storedToken, biometricPreference] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY),
        ]);
        const shouldRequireBiometrics =
          storedToken !== null && biometricPreference === 'true';

        setUserToken(storedToken);
        setBiometricEnabled(biometricPreference === 'true');

        if (shouldRequireBiometrics) {
          const result = await verifyBiometrics();
          if (!result.success) {
            setBiometricError(result.error || 'Authentication was cancelled.');
            setIsBiometricLocked(true);
          }
        }
      } catch (error) {
        console.error('Failed to load token from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedInStatus();
  }, []);

  const login = async () => {
    setIsLoading(true);
    const demoToken = `demo_jwt_token_${Date.now()}`;

    try {
      await AsyncStorage.setItem(TOKEN_KEY, demoToken);
      setUserToken(demoToken);
    } catch (error) {
      console.error('Failed to save token', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async () => login();

  const updateBiometricPreference = async (enabled) => {
    try {
      if (!enabled) {
        await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
        setBiometricEnabled(false);
        return { success: true };
      }

      const result = await verifyBiometrics();
      if (result.success) {
        await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
        setBiometricEnabled(true);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Unable to save the biometric login setting.',
      };
    }
  };

  const unlockWithBiometrics = async () => {
    setBiometricError(null);
    const result = await verifyBiometrics();
    if (result.success) {
      setIsBiometricLocked(false);
    } else {
      setBiometricError(result.error || 'Authentication was cancelled.');
    }
    return result;
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUserToken(null);
    } catch (error) {
      console.error('Failed to remove token', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        isLoading,
        biometricEnabled,
        isBiometricLocked,
        biometricError,
        login,
        register,
        logout,
        updateBiometricPreference,
        unlockWithBiometrics,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
