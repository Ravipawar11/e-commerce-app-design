import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, CustomText } from '../../components/common';
import { useCart } from '../../context/CartContext';
import { colors, fonts, sizes, spacing } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export const CartScreen = () => {
 const navigation = useNavigation()
  const {
    items,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    subtotal,
    savings,
    totalItems,
  } = useCart();

  const deliveryFee = subtotal > 0 ? (subtotal >= 999 ? 0 : 49) : 0;
  const total = subtotal + deliveryFee;

  /* ------------------------------ Empty State ------------------------------ */
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cart-outline" size={80} color={colors.textMuted} />
        <CustomText
          variant="bold"
          size={sizes.lg}
          color={colors.textPrimary}
          style={{ marginTop: spacing.md }}
        >
          Your cart is empty
        </CustomText>
        <CustomText
          variant="regular"
          size={sizes.sm}
          color={colors.textMuted}
          style={{ marginTop: spacing.xs, textAlign: 'center' }}
        >
          Browse products and add items you like
        </CustomText>
        <CustomButton
          title="Start Shopping"
          icon="storefront-outline"
          onPress={() => navigation.navigate('Home', { screen: 'Products' })}
          style={{ marginTop: spacing.lg, minWidth: 200 }}
        />
      </View>
    );
  }

  /* ------------------------------ Cart Item ------------------------------ */
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity
        style={styles.itemImageWrap}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('ProductDetails', { product: item })
        }
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      </TouchableOpacity>

      <View style={styles.itemBody}>
        <View style={styles.itemHeaderRow}>
          <CustomText
            variant="semibold"
            size={sizes.sm}
            color={colors.textPrimary}
            numberOfLines={2}
            style={{ flex: 1, marginRight: spacing.sm }}
          >
            {item.name}
          </CustomText>
          <TouchableOpacity
            onPress={() => removeFromCart(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="trash-outline" size={20} color={colors.danger || '#e53935'} />
          </TouchableOpacity>
        </View>

        <View style={styles.priceRow}>
          <CustomText variant="bold" size={sizes.md} color={colors.textPrimary}>
            ₹{item.price.toLocaleString('en-IN')}
          </CustomText>
          {item.originalPrice > item.price && (
            <CustomText
              variant="regular"
              size={sizes.xs}
              color={colors.textMuted}
              style={styles.strike}
            >
              ₹{item.originalPrice.toLocaleString('en-IN')}
            </CustomText>
          )}
        </View>

        <View style={styles.qtyRow}>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => decrement(item.id)}
            >
              <Icon name="remove" size={16} color={colors.primary} />
            </TouchableOpacity>
            <CustomText
              variant="semibold"
              size={sizes.sm}
              color={colors.textPrimary}
              style={styles.qtyText}
            >
              {item.qty}
            </CustomText>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => increment(item.id)}
            >
              <Icon name="add" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <CustomText
            variant="semibold"
            size={sizes.sm}
            color={colors.primary}
          >
            ₹{(item.price * item.qty).toLocaleString('en-IN')}
          </CustomText>
        </View>
      </View>
    </View>
  );

  /* ------------------------------ Summary Row ------------------------------ */
  const SummaryRow = ({ label, value, valueColor, bold }) => (
    <View style={styles.summaryRow}>
      <CustomText
        variant={bold ? 'semibold' : 'regular'}
        size={bold ? sizes.md : sizes.sm}
        color={colors.textSecondary}
      >
        {label}
      </CustomText>
      <CustomText
        variant={bold ? 'bold' : 'semibold'}
        size={bold ? sizes.md : sizes.sm}
        color={valueColor || colors.textPrimary}
      >
        {value}
      </CustomText>
    </View>
  );

  /* ------------------------------ Main Render ------------------------------ */
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row: item count + clear all */}
        <View style={styles.headerRow}>
          <CustomText variant="semibold" size={sizes.sm} color={colors.textSecondary}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </CustomText>
          <TouchableOpacity onPress={clearCart}>
            <CustomText
              variant="semibold"
              size={sizes.xs}
              color={colors.danger || '#e53935'}
            >
              Clear all
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Items */}
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: spacing.md }}
        />

        {/* Savings banner */}
        {savings > 0 && (
          <View style={styles.savingsBanner}>
            <Icon name="pricetag-outline" size={16} color={colors.success} />
            <CustomText
              variant="semibold"
              size={sizes.xs}
              color={colors.success}
              style={{ marginLeft: spacing.sm }}
            >
              You're saving ₹{savings.toLocaleString('en-IN')} on this order
            </CustomText>
          </View>
        )}

        {/* Coupon */}
        <TouchableOpacity style={styles.couponRow} activeOpacity={0.8}>
          <Icon name="pricetags-outline" size={18} color={colors.primary} />
          <CustomText
            variant="semibold"
            size={sizes.sm}
            color={colors.textPrimary}
            style={{ flex: 1, marginLeft: spacing.sm }}
          >
            Apply Coupon
          </CustomText>
          <Icon name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Order summary */}
        <View style={styles.summaryCard}>
          <CustomText
            variant="bold"
            size={sizes.md}
            color={colors.textPrimary}
            style={{ marginBottom: spacing.sm }}
          >
            Order Summary
          </CustomText>

          <SummaryRow
            label="Subtotal"
            value={`₹${subtotal.toLocaleString('en-IN')}`}
          />
          <SummaryRow
            label="Delivery"
            value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            valueColor={deliveryFee === 0 ? colors.success : undefined}
          />
          {savings > 0 && (
            <SummaryRow
              label="Discount"
              value={`- ₹${savings.toLocaleString('en-IN')}`}
              valueColor={colors.success}
            />
          )}

          <View style={styles.divider} />

          <SummaryRow
            label="Total"
            value={`₹${total.toLocaleString('en-IN')}`}
            bold
            valueColor={colors.primary}
          />
        </View>
      </ScrollView>

      {/* Sticky footer */}
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
          title="Checkout"
          icon="arrow-forward"
          iconPosition="right"
          onPress={() => navigation.navigate('Checkout')}
          style={{ flex: 1, marginLeft: spacing.md }}
        />
      </View>
    </View>
  );
};

/* ---------------------------------- Styles ----------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: 120 },

  /* Empty */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },

  /* Header row */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  /* Item card */
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemImageWrap: {
    width: 88,
    height: 88,
    borderRadius: sizes.radiusSm,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  itemImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  itemBody: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  strike: {
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.radiusSm,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  qtyText: {
    minWidth: 32,
    textAlign: 'center',
  },

  /* Savings banner */
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.sm,
    borderRadius: sizes.radiusSm,
    marginBottom: spacing.sm,
  },

  /* Coupon */
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },

  /* Summary */
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  /* Footer */
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});