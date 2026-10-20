import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, CustomText } from '../../components/common';
import { colors, fonts, sizes, spacing } from '../../theme';
import { useCart } from '../../context/CartContext';

export const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
const { addToCart } = useCart();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.body}>
          <CustomText variant="bold" size={sizes.xl} color={colors.textPrimary}>
            {product.name}
          </CustomText>

          <View style={styles.row}>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={12} color="#fff" />
              <CustomText variant="semibold" size={sizes.xs} color="#fff" style={{ marginLeft: 2 }}>
                {product.rating}
              </CustomText>
            </View>
            <CustomText variant="regular" size={sizes.xs} color={colors.textMuted} style={{ marginLeft: spacing.sm }}>
              {product.category}
            </CustomText>
          </View>

          <View style={[styles.row, { marginTop: spacing.md }]}>
            <CustomText variant="bold" size={sizes.xl} color={colors.primary}>
              ₹{product.price.toLocaleString('en-IN')}
            </CustomText>
            <CustomText
              variant="regular"
              size={sizes.sm}
              color={colors.textMuted}
              style={styles.strike}
            >
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </CustomText>
            <CustomText variant="semibold" size={sizes.sm} color={colors.success} style={{ marginLeft: spacing.sm }}>
              {product.discount}
            </CustomText>
          </View>

          <CustomText variant="semibold" size={sizes.md} color={colors.textPrimary} style={{ marginTop: spacing.lg }}>
            Description
          </CustomText>
          <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary} style={{ marginTop: spacing.xs, lineHeight: 20 }}>
            High-quality {product.name.toLowerCase()} designed for everyday use. Premium build,
            great value, and backed by our satisfaction guarantee.
          </CustomText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Add to Cart"
          onPress={() => {addToCart(product)
          Alert.alert(
            'Added to Cart',
            `${product.name} has been added to your cart.`,
            [{ text: 'OK' }]
          );}
        }

          
          
          style={{ flex: 1, marginRight: spacing.sm }}
        />
        <CustomButton title="Buy Now" onPress={() => {
    addToCart(product);
    navigation.navigate('Cart');
  }} style={{ flex: 1 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { width: '100%', height: 320, resizeMode: 'cover' },
  body: { padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: sizes.radiusSm,
  },
  strike: { textDecorationLine: 'line-through', marginLeft: spacing.sm },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});