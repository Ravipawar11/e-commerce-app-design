import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomText } from '../../components/common';
import { colors, sizes } from '../../theme';

export const SettingsScreen = () => (
  <View style={styles.container}>
    <CustomText variant="bold" size={sizes.xxl}>Settings</CustomText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});