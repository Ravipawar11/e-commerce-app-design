import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { CustomButton, CustomText } from '../../components/common';
import { colors, sizes, spacing } from '../../theme';

export const ProfileScreen = () => {
  const { logout, isLoading } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <CustomText variant="bold" size={sizes.xxl}>User Profile</CustomText>
      <CustomButton
        title="Log Out"
        onPress={logout}
        loading={isLoading}
        variant="outline"
        style={styles.logoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  logoutButton: {
    marginTop: spacing.xl,
    width: '100%',
  },
});