import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const TOKEN_KEY = '@user_demo_token';

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        setUserToken(storedToken);
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
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
