import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, CustomText } from '../../components/common';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { colors, fonts, sizes, spacing } from '../../theme';

/* ---------------------------------- Reusable Row ----------------------------------- */
const SettingsRow = ({
  icon,
  iconColor,
  label,
  value,
  onPress,
  rightElement,
  showChevron = true,
  danger = false,
}) => {
  const RowWrapper = onPress ? TouchableOpacity : View;
  return (
    <RowWrapper
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: (iconColor || colors.primary) + '18' }, // 10% tint
        ]}
      >
        <Icon name={icon} size={18} color={iconColor || colors.primary} />
      </View>

      <CustomText
        variant="medium"
        size={sizes.sm}
        color={danger ? (colors.danger || '#e53935') : colors.textPrimary}
        style={{ flex: 1, marginLeft: spacing.md }}
      >
        {label}
      </CustomText>

      {value ? (
        <CustomText
          variant="regular"
          size={sizes.xs}
          color={colors.textMuted}
          style={{ marginRight: spacing.sm }}
        >
          {value}
        </CustomText>
      ) : null}

      {rightElement}

      {showChevron && onPress && !rightElement && (
        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </RowWrapper>
  );
};

/* ---------------------------------- Reusable Section ----------------------------------- */
const SettingsSection = ({ title, children }) => (
  <View style={styles.section}>
    {title ? (
      <CustomText
        variant="semibold"
        size={sizes.xs}
        color={colors.textMuted}
        style={styles.sectionTitle}
      >
        {title.toUpperCase()}
      </CustomText>
    ) : null}
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ---------------------------------- Screen ----------------------------------- */
export const SettingsScreen = ({ navigation }) => {
  const { logout, biometricEnabled, updateBiometricPreference } = React.useContext(AuthContext);
  const { clearCart } = useCart();

  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isUpdatingBiometric, setIsUpdatingBiometric] = useState(false);

  const handleBiometricChange = async (enabled) => {
    setIsUpdatingBiometric(true);
    const result = await updateBiometricPreference(enabled);
    setIsUpdatingBiometric(false);

    if (!result.success) {
      Alert.alert(
        'Biometric login unavailable',
        result.error || 'Set up Face ID, Touch ID, or a device passcode and try again.',
      );
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => {
            clearCart?.();
            logout?.();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <TouchableOpacity
        style={styles.profileCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <CustomText variant="bold" size={sizes.md} color={colors.textPrimary}>
            John Doe
          </CustomText>
          <CustomText
            variant="regular"
            size={sizes.xs}
            color={colors.textMuted}
            style={{ marginTop: 2 }}
          >
            john.doe@example.com
          </CustomText>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Account */}
      <SettingsSection title="Account">
        <SettingsRow
          icon="person-outline"
          label="Edit Profile"
          onPress={() => navigation.navigate('Profile')}
        />
        <Divider />
        <SettingsRow
          icon="location-outline"
          label="Saved Addresses"
          onPress={() => navigation.navigate('Addresses')}
        />
        <Divider />
        <SettingsRow
          icon="card-outline"
          label="Payment Methods"
          onPress={() => navigation.navigate('Payments')}
        />
        <Divider />
        <SettingsRow
          icon="receipt-outline"
          label="My Orders"
          onPress={() => navigation.navigate('Orders')}
        />
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection title="Preferences">
        <SettingsRow
          icon="notifications-outline"
          label="Push Notifications"
          showChevron={false}
          rightElement={
            <Switch
              value={pushNotif}
              onValueChange={setPushNotif}
              trackColor={{ false: colors.border, true: colors.primary + '66' }}
              thumbColor={pushNotif ? colors.primary : '#f4f3f4'}
            />
          }
        />
        <Divider />
        <SettingsRow
          icon="mail-outline"
          label="Email Notifications"
          showChevron={false}
          rightElement={
            <Switch
              value={emailNotif}
              onValueChange={setEmailNotif}
              trackColor={{ false: colors.border, true: colors.primary + '66' }}
              thumbColor={emailNotif ? colors.primary : '#f4f3f4'}
            />
          }
        />
        <Divider />
        <SettingsRow
          icon="moon-outline"
          label="Dark Mode"
          showChevron={false}
          rightElement={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.primary + '66' }}
              thumbColor={darkMode ? colors.primary : '#f4f3f4'}
            />
          }
        />
        <Divider />
        <SettingsRow
          icon="language-outline"
          label="Language"
          value="English"
          onPress={() => {}}
        />
      </SettingsSection>

      {/* Security */}
      <SettingsSection title="Security">
        <SettingsRow
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <Divider />
        <SettingsRow
          icon="finger-print-outline"
          label="Biometric Login"
          showChevron={false}
          rightElement={
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricChange}
              disabled={isUpdatingBiometric}
              trackColor={{ false: colors.border, true: colors.primary + '66' }}
              thumbColor={biometricEnabled ? colors.primary : '#f4f3f4'}
            />
          }
        />
        <Divider />
        <SettingsRow
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={() => {}}
        />
      </SettingsSection>

      {/* Support */}
      <SettingsSection title="Support">
        <SettingsRow
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => navigation.navigate('Help')}
        />
        <Divider />
        <SettingsRow
          icon="chatbubble-ellipses-outline"
          label="Send Feedback"
          onPress={() => {}}
        />
        <Divider />
        <SettingsRow
          icon="star-outline"
          label="Rate the App"
          onPress={() => {}}
        />
        <Divider />
        <SettingsRow
          icon="information-circle-outline"
          label="About"
          value="v1.0.0"
          onPress={() => {}}
        />
      </SettingsSection>

      {/* Logout */}
      <SettingsSection>
        <SettingsRow
          icon="log-out-outline"
          iconColor={colors.danger || '#e53935'}
          label="Log Out"
          danger
          showChevron={false}
          onPress={confirmLogout}
        />
      </SettingsSection>

      {/* Delete account */}
      <CustomButton
        title="Delete Account"
        variant="outline"
        icon="trash-outline"
        onPress={() => {}}
        style={styles.deleteBtn}
        textStyle={{ color: colors.danger || '#e53935' }}
      />

      <CustomText
        variant="regular"
        size={sizes.xs}
        color={colors.textMuted}
        style={styles.version}
      >
        Made with ❤️ · Version 1.0.0
      </CustomText>
    </ScrollView>
  );
};

/* ---------------------------------- Styles ----------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xl },

  /* Profile card */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
  },

  /* Section */
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  /* Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 34 + spacing.md, // aligns with text
  },

  /* Footer */
  deleteBtn: {
    marginTop: spacing.sm,
    borderColor: colors.danger || '#e53935',
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
