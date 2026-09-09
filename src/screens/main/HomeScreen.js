import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { CustomText } from '../../components/common';
import { colors, sizes, spacing } from '../../theme';

export const HomeScreen = () => {
  const { userToken } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <CustomText variant="bold" size={sizes.xxl}>Home Dashboard</CustomText>
      <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary} style={styles.tokenText}>
        Active Token: {userToken}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  tokenText: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});