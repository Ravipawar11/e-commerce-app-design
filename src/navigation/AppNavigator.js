import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { DrawerNavigator } from './DrawerNavigator'; // <-- changed
import { BiometricLockScreen, LoadingScreen } from '../components/states';

export const AppNavigator = () => {
  const {
    userToken,
    isLoading,
    isBiometricLocked,
    biometricError,
    unlockWithBiometrics,
  } = useContext(AuthContext);
  const [isUnlocking, setIsUnlocking] = useState(false);

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (userToken !== null && isBiometricLocked) {
    const handleUnlock = async () => {
      setIsUnlocking(true);
      await unlockWithBiometrics();
      setIsUnlocking(false);
    };

    return (
      <BiometricLockScreen
        error={biometricError}
        onUnlock={handleUnlock}
        isUnlocking={isUnlocking}
      />
    );
  }

  return (
    <NavigationContainer>
      {userToken !== null ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

