import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { CustomButton, CustomText } from '../../components/common';
import { colors, fonts, sizes, spacing } from '../../theme';

export const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useContext(AuthContext);

  const handleRegister = () => {
    if (!name || !email || !password) return;
    register(name, email, password);
  };

  return (
    <View style={styles.container}>
      <CustomText variant="bold" size={sizes.title} color={colors.primary}>
        Create Account
      </CustomText>
      <CustomText variant="regular" size={sizes.md} color={colors.textSecondary} style={styles.subtitle}>
        Sign up to get started
      </CustomText>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton
        title="Register"
        onPress={handleRegister}
        loading={isLoading}
        style={styles.button}
      />

      <View style={styles.footer}>
        <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary}>
          Already have an account?{' '}
        </CustomText>
        <CustomText
          variant="semibold"
          size={sizes.sm}
          color={colors.primary}
          onPress={() => navigation.navigate('Login')}
        >
          Log In
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  subtitle: {
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.radiusMd,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.family.regular,
    fontSize: sizes.md,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
