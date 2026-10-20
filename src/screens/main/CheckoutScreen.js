import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, CustomText } from '../../components/common';
import { useCart } from '../../context/CartContext';
import { colors, fonts, sizes, spacing } from '../../theme';

const PAYMENT_METHODS = [
  { id: 'cod',      label: 'Cash on Delivery', icon: 'cash-outline',      subtitle: 'Pay when you receive' },
  { id: 'card',     label: 'Credit / Debit Card', icon: 'card-outline',   subtitle: 'Visa, Mastercard, RuPay' },
  { id: 'upi',      label: 'UPI',                icon: 'phone-portrait-outline', subtitle: 'GPay, PhonePe, Paytm' },
  { id: 'wallet',   label: 'Wallet',             icon: 'wallet-outline',  subtitle: 'Use your app wallet' },
];

export const CheckoutScreen = ({ navigation }) => {
  const { items, subtotal, savings, clearCart } = useCart();

  // ---- Local form state ----
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);

  const deliveryFee = subtotal > 0 ? (subtotal >= 999 ? 0 : 49) : 0;
  const total = subtotal + deliveryFee;

  // ---- Address update helper ----
  const setField = (key, value) =>
    setAddress((prev) => ({ ...prev, [key]: value }));

  // ---- Validation ----
  const validate = () => {
    if (items.length === 0) return 'Your cart is empty.';
    if (!address.fullName.trim()) return 'Please enter your full name.';
    if (!/^\d{10}$/.test(address.phone.trim())) return 'Please enter a valid 10-digit phone number.';
    if (!address.line1.trim()) return 'Please enter your address.';
    if (!address.city.trim()) return 'Please enter your city.';
    if (!address.state.trim()) return 'Please enter your state.';
    if (!/^\d{6}$/.test(address.pincode.trim())) return 'Please enter a valid 6-digit pincode.';
    return null;
  };

  // ---- Place order ----
  const handlePlaceOrder = () => {
    const error = validate();
    if (error) {
      Alert.alert('Missing details', error);
      return;
    }

    setPlacing(true);

    // Simulate API call. Replace with real order API later.
    setTimeout(() => {
      setPlacing(false);
      clearCart();
      Alert.alert(
        'Order Placed',
        `Your order of ₹${total.toLocaleString('en-IN')} has been placed successfully.`,
        [
          {
            text: 'View Orders',
            onPress: () => navigation.navigate('MyOrders'),
          },
          {
            text: 'Continue Shopping',
            style: 'cancel',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    }, 1200);
  };

  // ---- Guard: empty cart ----
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="cart-outline" size={72} color={colors.textMuted} />
        <CustomText variant="bold" size={sizes.md} color={colors.textPrimary} style={{ marginTop: spacing.md }}>
          Nothing to checkout
        </CustomText>
        <CustomButton
          title="Go Shopping"
          onPress={() => navigation.navigate('Home')}
          style={{ marginTop: spacing.lg, minWidth: 200 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* -------- Delivery Address -------- */}
        <SectionTitle title="Delivery Address" icon="location-outline" />
        <View style={styles.card}>
          <Field label="Full Name"  value={address.fullName} onChangeText={(t) => setField('fullName', t)} />
          <Field
            label="Phone Number"
            value={address.phone}
            onChangeText={(t) => setField('phone', t.replace(/[^0-9]/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <Field label="Address Line" value={address.line1} onChangeText={(t) => setField('line1', t)} multiline />
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Field label="City" value={address.city} onChangeText={(t) => setField('city', t)} />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="State" value={address.state} onChangeText={(t) => setField('state', t)} />
            </View>
          </View>
          <Field
            label="Pincode"
            value={address.pincode}
            onChangeText={(t) => setField('pincode', t.replace(/[^0-9]/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        {/* -------- Delivery Method -------- */}
        <SectionTitle title="Delivery Method" icon="car-outline" />
        <View style={styles.card}>
          <View style={styles.deliveryRow}>
            <Icon name="flash-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <CustomText variant="semibold" size={sizes.sm} color={colors.textPrimary}>
                Standard Delivery
              </CustomText>
              <CustomText variant="regular" size={sizes.xs} color={colors.textMuted}>
                Arrives in 3–5 business days
              </CustomText>
            </View>
            <CustomText variant="bold" size={sizes.sm} color={deliveryFee === 0 ? colors.success : colors.textPrimary}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </CustomText>
          </View>
        </View>

        {/* -------- Payment Method -------- */}
        <SectionTitle title="Payment Method" icon="card-outline" />
        <View style={styles.card}>
          {PAYMENT_METHODS.map((m, i) => {
            const selected = paymentMethod === m.id;
            return (
              <React.Fragment key={m.id}>
                <TouchableOpacity
                  style={styles.paymentRow}
                  onPress={() => setPaymentMethod(m.id)}
                  activeOpacity={0.7}
                >
                  <Icon name={m.icon} size={20} color={selected ? colors.primary : colors.textMuted} />
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <CustomText variant="semibold" size={sizes.sm} color={colors.textPrimary}>
                      {m.label}
                    </CustomText>
                    <CustomText variant="regular" size={sizes.xs} color={colors.textMuted}>
                      {m.subtitle}
                    </CustomText>
                  </View>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
                {i < PAYMENT_METHODS.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* -------- Order Summary -------- */}
        <SectionTitle title="Order Summary" icon="receipt-outline" />
        <View style={styles.card}>
          {items.map((it) => (
            <View key={it.id} style={styles.summaryItemRow}>
              <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary} style={{ flex: 1 }}>
                {it.name} × {it.qty}
              </CustomText>
              <CustomText variant="semibold" size={sizes.sm} color={colors.textPrimary}>
                ₹{(it.price * it.qty).toLocaleString('en-IN')}
              </CustomText>
            </View>
          ))}

          <View style={styles.divider} />

          <SummaryRow label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
          <SummaryRow
            label="Delivery"
            value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            valueColor={deliveryFee === 0 ? colors.success : undefined}
          />
          {savings > 0 && (
            <SummaryRow label="Discount" value={`- ₹${savings.toLocaleString('en-IN')}`} valueColor={colors.success} />
          )}

          <View style={styles.divider} />

          <SummaryRow label="Total" value={`₹${total.toLocaleString('en-IN')}`} bold valueColor={colors.primary} />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* -------- Sticky footer -------- */}
      <View style={styles.footer}>
        <View>
          <CustomText variant="regular" size={sizes.xs} color={colors.textMuted}>
            Total
          </CustomText>
          <CustomText variant="bold" size={sizes.lg} color={colors.textPrimary}>
            ₹{total.toLocaleString('en-IN')}
          </CustomText>
        </View>
        <CustomButton
          title="Place Order"
          icon="checkmark-circle-outline"
          onPress={handlePlaceOrder}
          loading={placing}
          disabled={placing}
          style={{ flex: 1, marginLeft: spacing.md }}
        />
      </View>
    </View>
  );
};

/* ---------------------------------- Small helpers ----------------------------------- */
const SectionTitle = ({ title, icon }) => (
  <View style={styles.sectionTitleRow}>
    <Icon name={icon} size={16} color={colors.primary} />
    <CustomText
      variant="semibold"
      size={sizes.sm}
      color={colors.textPrimary}
      style={{ marginLeft: spacing.xs }}
    >
      {title}
    </CustomText>
  </View>
);

const Field = ({ label, value, onChangeText, keyboardType, maxLength, multiline }) => (
  <View style={{ marginBottom: spacing.sm }}>
    <CustomText variant="medium" size={sizes.xs} color={colors.textMuted} style={styles.fieldLabel}>
      {label}
    </CustomText>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      maxLength={maxLength}
      multiline={multiline}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor={colors.textMuted}
      style={[styles.input, multiline && { height: 72, textAlignVertical: 'top' }]}
    />
  </View>
);

const SummaryRow = ({ label, value, valueColor, bold }) => (
  <View style={styles.summaryRow}>
    <CustomText variant={bold ? 'semibold' : 'regular'} size={bold ? sizes.md : sizes.sm} color={colors.textSecondary}>
      {label}
    </CustomText>
    <CustomText variant={bold ? 'bold' : 'semibold'} size={bold ? sizes.md : sizes.sm} color={valueColor || colors.textPrimary}>
      {value}
    </CustomText>
  </View>
);

/* ---------------------------------- Styles ----------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },

  /* Inputs */
  fieldLabel: { marginBottom: 4, marginLeft: spacing.xs, letterSpacing: 0.4 },
  input: {
    height: 46,
    paddingHorizontal: spacing.md,
    borderRadius: sizes.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    fontFamily: fonts.family.medium,
    fontSize: sizes.sm,
    color: colors.textPrimary,
  },
  row: { flexDirection: 'row' },

  /* Delivery */
  deliveryRow: { flexDirection: 'row', alignItems: 'center' },

  /* Payment */
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  /* Summary */
  summaryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  /* Footer */
  footer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});