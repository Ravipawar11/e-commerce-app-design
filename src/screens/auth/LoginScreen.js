import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView, // <-- Added SafeAreaView
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthContext';
import { CustomButton, CustomText } from '../../components/common';
import { colors, fonts, sizes, spacing } from '../../theme';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useContext(AuthContext);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogin = () => {
    if (!email || !password) return;
    login(email, password);
  };

  return (
    // SafeAreaView ensures content is not hidden behind the notch
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <MaterialCommunityIcons name="star-four-points" size={30} color="#FFF" />
              </View>
            </View>

            {/* Header Section */}
            <CustomText variant="bold" style={styles.title}>
              Sign In
            </CustomText>
            <CustomText variant="regular" style={styles.subtitle}>
              To sign in to an account in the application, enter your email and password
            </CustomText>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email-outline"
                size={22}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor={colors.textMuted || colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={22}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textMuted || colors.textSecondary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <CustomText variant="semibold" style={styles.forgotPasswordText}>
                Forgot password?
              </CustomText>
            </TouchableOpacity>

            {/* Primary Button */}
            <CustomButton
              title="Continue"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.button}
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <CustomText variant="regular" style={styles.dividerText}>
                Don't have an account yet?
              </CustomText>
              <View style={styles.dividerLine} />
            </View>

            {/* Secondary Buttons */}
            <TouchableOpacity
              style={[styles.secondaryButton]}
              onPress={() => navigation.navigate('Register')}
            >
              <CustomText variant="bold" style={styles.secondaryButtonText}>
                Create an account
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryButton]}>
              <MaterialCommunityIcons name="apple" size={22} color="#000" style={styles.socialIcon} />
              <CustomText variant="bold" style={styles.secondaryButtonText}>
                Sign in with Apple
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryButton]}>
              <MaterialCommunityIcons name="google" size={22} color="#EA4335" style={styles.socialIcon} />
              <CustomText variant="bold" style={styles.secondaryButtonText}>
                Sign in with Google
              </CustomText>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <CustomText variant="regular" style={styles.footerText}>
                By clicking "Continue", I have read and agree with the{' '}
                <CustomText style={styles.footerLink}>Term Sheet</CustomText>,{' '}
                <CustomText style={styles.footerLink}>Privacy Policy</CustomText>
              </CustomText>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // Ensures the notch area is filled with background color
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 40, // Added extra padding to push content down slightly
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderRadius: 25,
    marginBottom: 16,
    paddingHorizontal: 20,
    height: 56,
    width: '100%',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    height: '100%',
    fontFamily: fonts?.family?.regular || undefined,
  },
  forgotPasswordContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    marginBottom: 16,
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F4F6F8',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  socialIcon: {
    marginRight: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.textSecondary,
    fontSize: 13,
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  // footerLink: {
  //   textDecorationLine: 'underline',
  //   color: colors.textPrimary,
  // },
});