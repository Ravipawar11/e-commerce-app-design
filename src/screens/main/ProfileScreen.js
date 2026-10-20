import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { CustomButton, CustomText } from '../../components/common';
import { colors, fonts, sizes, spacing } from '../../theme';

/* ---------------------------------- Reusable Stat Cell ----------------------------------- */
const StatCell = ({ icon, label, value, color }) => (
  <View style={styles.statCell}>
    <View style={[styles.statIconWrap, { backgroundColor: (color || colors.primary) + '18' }]}>
      <Icon name={icon} size={18} color={color || colors.primary} />
    </View>
    <CustomText variant="bold" size={sizes.md} color={colors.textPrimary} style={{ marginTop: spacing.xs }}>
      {value}
    </CustomText>
    <CustomText variant="regular" size={sizes.xs} color={colors.textMuted}>
      {label}
    </CustomText>
  </View>
);

/* ---------------------------------- Reusable Menu Row ----------------------------------- */
const MenuRow = ({ icon, label, value, onPress, showChevron = true, danger = false }) => (
  <TouchableOpacity style={styles.menuRow} activeOpacity={0.7} onPress={onPress}>
    <View
      style={[
        styles.menuIconWrap,
        {
          backgroundColor:
            (danger ? colors.danger || '#e53935' : colors.primary) + '18',
        },
      ]}
    >
      <Icon
        name={icon}
        size={18}
        color={danger ? colors.danger || '#e53935' : colors.primary}
      />
    </View>
    <CustomText
      variant="medium"
      size={sizes.sm}
      color={danger ? colors.danger || '#e53935' : colors.textPrimary}
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
    {showChevron && onPress && (
      <Icon name="chevron-forward" size={18} color={colors.textMuted} />
    )}
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

/* ---------------------------------- Editable Field ----------------------------------- */
const EditableField = ({ label, value, onChangeText, keyboardType, autoCapitalize }) => (
  <View style={styles.fieldWrap}>
    <CustomText variant="medium" size={sizes.xs} color={colors.textMuted} style={styles.fieldLabel}>
      {label}
    </CustomText>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      autoCapitalize={autoCapitalize || 'sentences'}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor={colors.textMuted}
      style={styles.input}
    />
  </View>
);

/* ---------------------------------- Screen ----------------------------------- */
export const ProfileScreen = ({ navigation }) => {
  const { logout, isLoading } = useContext(AuthContext);

  // ---- Local profile state (only for this screen) ----
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://i.pravatar.cc/150?img=12',
  });
  // Draft holds the in-progress edits, so Cancel can revert
  const [draft, setDraft] = useState(profile);

  const stats = [
    { icon: 'bag-handle-outline', label: 'Orders',   value: '12', color: colors.primary },
    { icon: 'heart-outline',      label: 'Wishlist', value: '8',  color: '#e53935' },
    { icon: 'star-outline',       label: 'Reviews',  value: '24', color: '#f5a623' },
  ];

  // ---- Edit handlers ----
  const startEdit = () => {
    setDraft(profile); // copy current values into the form
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(profile); // discard changes
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      Alert.alert('Missing info', 'Name and email cannot be empty.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    setProfile(draft); // commit
    setIsEditing(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  const confirmLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: () => logout?.() },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          {isEditing && (
            <TouchableOpacity style={styles.editBadge} activeOpacity={0.85}>
              <Icon name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          /* ---------- EDIT MODE ---------- */
          <View style={styles.editForm}>
            <EditableField
              label="Name"
              value={draft.name}
              onChangeText={(t) => setDraft({ ...draft, name: t })}
            />
            <EditableField
              label="Email"
              value={draft.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(t) => setDraft({ ...draft, email: t })}
            />
            <EditableField
              label="Phone"
              value={draft.phone}
              keyboardType="phone-pad"
              onChangeText={(t) => setDraft({ ...draft, phone: t })}
            />

            <View style={styles.editActions}>
              <CustomButton
                title="Cancel"
                variant="outline"
                size="sm"
                onPress={cancelEdit}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <CustomButton
                title="Save"
                icon="checkmark"
                size="sm"
                onPress={saveEdit}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          /* ---------- VIEW MODE ---------- */
          <>
            <CustomText
              variant="bold"
              size={sizes.lg}
              color={colors.textPrimary}
              style={{ marginTop: spacing.md }}
            >
              {profile.name}
            </CustomText>
            <CustomText
              variant="regular"
              size={sizes.sm}
              color={colors.textMuted}
              style={{ marginTop: 2 }}
            >
              {profile.email}
            </CustomText>
            <CustomText
              variant="regular"
              size={sizes.xs}
              color={colors.textMuted}
              style={{ marginTop: 2 }}
            >
              {profile.phone}
            </CustomText>

            <CustomButton
              title="Edit Profile"
              icon="create-outline"
              size="sm"
              variant="outline"
              onPress={startEdit}
              style={styles.editBtn}
            />
          </>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            <StatCell {...s} />
            {i < stats.length - 1 && <View style={styles.statDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* Account */}
      <CustomText variant="semibold" size={sizes.xs} color={colors.textMuted} style={styles.sectionTitle}>
        ACCOUNT
      </CustomText>
      <View style={styles.card}>
        <MenuRow icon="receipt-outline"  label="My Orders"       onPress={() => {}} />
        <Divider />
        <MenuRow icon="heart-outline"    label="Wishlist"        value="8 items" onPress={() => {}} />
        <Divider />
        <MenuRow icon="location-outline" label="Saved Addresses" onPress={() => {}} />
        <Divider />
        <MenuRow icon="card-outline"     label="Payment Methods" onPress={() => {}} />
        <Divider />
        <MenuRow icon="pricetag-outline" label="Coupons"         value="3 available" onPress={() => {}} />
      </View>

      {/* Settings & Support */}
      <CustomText variant="semibold" size={sizes.xs} color={colors.textMuted} style={styles.sectionTitle}>
        SETTINGS & SUPPORT
      </CustomText>
      <View style={styles.card}>
        <MenuRow icon="settings-outline"        label="Settings"       onPress={() => navigation.navigate('Settings')} />
        <Divider />
        <MenuRow icon="help-circle-outline"     label="Help & Support" onPress={() => navigation.navigate('Help')} />
        <Divider />
        <MenuRow icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => {}} />
        <Divider />
        <MenuRow icon="information-circle-outline" label="About" value="v1.0.0" onPress={() => {}} />
      </View>

      {/* Logout */}
      <CustomButton
        title="Log Out"
        icon="log-out-outline"
        variant="outline"
        loading={isLoading}
        onPress={confirmLogout}
        style={styles.logoutBtn}
        textStyle={{ color: colors.danger || '#e53935' }}
      />

      <CustomText variant="regular" size={sizes.xs} color={colors.textMuted} style={styles.version}>
        Version 1.0.0
      </CustomText>
    </ScrollView>
  );
};

/* ---------------------------------- Styles ----------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xl },

  /* Header */
  header: { alignItems: 'center', paddingVertical: spacing.lg },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  editBtn: { marginTop: spacing.md, minWidth: 160 },

  /* Edit form */
  editForm: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
  fieldWrap: { marginBottom: spacing.md },
  fieldLabel: { marginBottom: spacing.xs, marginLeft: spacing.xs, letterSpacing: 0.5 },
  input: {
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontFamily: fonts.family.medium,
    fontSize: sizes.sm,
    color: colors.textPrimary,
  },
  editActions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },

  /* Stats */
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  statCell: { flex: 1, alignItems: 'center' },
  statIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: spacing.sm },

  /* Section */
  sectionTitle: {
    marginLeft: spacing.xs,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },

  /* Menu row */
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  menuIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 34 + spacing.md,
  },

  /* Footer */
  logoutBtn: { borderColor: colors.danger || '#e53935' },
  version: { textAlign: 'center', marginTop: spacing.lg },
});