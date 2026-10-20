import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, CustomText } from '../../components/common';
import { colors, fonts, sizes, spacing } from '../../theme';
import { useCart } from '../../context/CartContext';

const categories = [
  { id: '1', name: 'Fashion',     image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300' },
  { id: '2', name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300' },
  { id: '3', name: 'Shoes',       image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300' },
  { id: '4', name: 'Beauty',      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300' },
  { id: '5', name: 'Home',        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300' },
  { id: '6', name: 'Sports',      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300' },
];

const products = [
  { id: '1', name: 'Wireless Headphones', price: 1999, originalPrice: 2999, discount: '33% OFF', rating: '4.5', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
  { id: '2', name: 'Running Shoes',       price: 2499, originalPrice: 3999, discount: '37% OFF', rating: '4.6', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
  { id: '3', name: 'Smart Watch',         price: 3499, originalPrice: 4999, discount: '30% OFF', rating: '4.4', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { id: '4', name: 'Casual Backpack',     price: 1299, originalPrice: 1999, discount: '35% OFF', rating: '4.3', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500' },
];

const offers = [
  { id: '1', title: 'Big Fashion Sale',  subtitle: 'Up to 50% OFF',       image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id: '2', title: 'Electronics Deals', subtitle: 'Starting from ₹999',  image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800' },
];

export const HomeScreen = ({ navigation }) => {
  const { totalItems, addToCart } = useCart();

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryImageContainer}>
        <Image source={{ uri: item.image }} style={styles.categoryImage} />
      </View>
      <CustomText variant="medium" size={sizes.xs} color={colors.textPrimary} style={styles.categoryName}>
        {item.name}
      </CustomText>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
      </View>
      <View style={styles.productContent}>
        <CustomText variant="medium" size={sizes.sm} color={colors.textPrimary} numberOfLines={2}>
          {item.name}
        </CustomText>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingBadge}>
            <CustomText variant="semibold" size={sizes.xs} color={colors.white}>
              ★ {item.rating}
            </CustomText>
          </View>
        </View>

        <View style={styles.priceRow}>
          <CustomText variant="bold" size={sizes.md} color={colors.textPrimary}>
            ₹{item.price.toLocaleString('en-IN')}
          </CustomText>
          <CustomText variant="regular" size={sizes.xs} color={colors.textMuted} style={styles.originalPrice}>
            ₹{item.originalPrice.toLocaleString('en-IN')}
          </CustomText>
        </View>

        <CustomText variant="semibold" size={sizes.xs} color={colors.success}>
          {item.discount}
        </CustomText>

        <CustomButton
  title="Add to Cart"
  icon="cart-outline"
  size="sm"
  onPress={() => {
    addToCart(item);
    Alert.alert(
      'Added to Cart',
      `${item.name} has been added to your cart.`,
      [{ text: 'OK' }]
    );
  }}
  style={styles.addButton}
/>
      </View>
    </TouchableOpacity>
  );

  const renderOffer = ({ item }) => (
    <TouchableOpacity
      style={styles.offerCard}
      onPress={() => navigation.navigate('Products')}
    >
      <Image source={{ uri: item.image }} style={styles.offerImage} />
      <View style={styles.offerOverlay}>
        <CustomText variant="bold" size={sizes.lg} color={colors.white}>
          {item.title}
        </CustomText>
        <CustomText variant="medium" size={sizes.sm} color={colors.white} style={styles.offerSubtitle}>
          {item.subtitle}
        </CustomText>
        <View style={styles.shopButton}>
          <CustomText variant="semibold" size={sizes.xs} color={colors.textPrimary}>
            Shop Now
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <CustomText variant="regular" size={sizes.xs} color={colors.textSecondary}>
              Deliver to
            </CustomText>
            <CustomText variant="semibold" size={sizes.sm} color={colors.textPrimary} style={styles.locationText}>
              Pune, Maharashtra
            </CustomText>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Icon name="cart-outline" size={24} color={colors.textPrimary} />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <CustomText variant="bold" size={sizes.xs} color={colors.white}>
                  {totalItems}
                </CustomText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate('Products')}
        >
          <CustomText variant="regular" size={sizes.sm} color={colors.textMuted}>
            🔍 Search for products...
          </CustomText>
        </TouchableOpacity>

        {/* Categories */}
        <SectionHeader title="Categories" onPress={() => navigation.navigate('Products')} />
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />

        {/* Banner */}
        <TouchableOpacity
          style={styles.banner}
          onPress={() => navigation.navigate('Products')}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerContent}>
            <CustomText variant="bold" size={sizes.xl} color={colors.white}>
              Mega Sale
            </CustomText>
            <CustomText variant="medium" size={sizes.sm} color={colors.white} style={styles.bannerSubtitle}>
              Up to 70% OFF
            </CustomText>
            <View style={styles.bannerButton}>
              <CustomText variant="semibold" size={sizes.xs} color={colors.textPrimary}>
                Shop Now
              </CustomText>
            </View>
          </View>
        </TouchableOpacity>

        {/* Featured Products */}
        <SectionHeader title="Featured Products" onPress={() => navigation.navigate('Products')} />
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.productRow}
        />

        {/* Offers */}
        <SectionHeader title="Special Offers" onPress={() => navigation.navigate('Products')} />
        <FlatList
          data={offers}
          renderItem={renderOffer}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offerList}
        />

        {/* Popular Products */}
        <SectionHeader title="Popular Products" onPress={() => navigation.navigate('Products')} />
        <FlatList
          data={products.slice(0, 3)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.popularCard}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            >
              <Image source={{ uri: item.image }} style={styles.popularImage} />
              <CustomText variant="medium" size={sizes.sm} color={colors.textPrimary} numberOfLines={1}>
                {item.name}
              </CustomText>
              <CustomText variant="bold" size={sizes.md} color={colors.primary} style={styles.popularPrice}>
                ₹{item.price.toLocaleString('en-IN')}
              </CustomText>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularList}
        />
      </ScrollView>
    </View>
  );
};

const SectionHeader = ({ title, onPress }) => (
  <View style={styles.sectionHeader}>
    <CustomText variant="bold" size={sizes.lg} color={colors.textPrimary}>
      {title}
    </CustomText>
    <TouchableOpacity onPress={onPress}>
      <CustomText variant="semibold" size={sizes.sm} color={colors.primary}>
        See All
      </CustomText>
    </TouchableOpacity>
  </View>
);

/* ---------------------------------- Styles ----------------------------------- */ const styles =
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingBottom: spacing.xl },
    /* Header */ header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    locationText: { marginTop: spacing.xs },
    cartButton: {
      width: 44,
      height: 44,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    /* Search */ searchContainer: {
      height: 48,
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: sizes.radiusMd,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    /* Section */ sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    /* Categories */ categoryList: { paddingHorizontal: spacing.md },
    categoryItem: { width: 72, alignItems: 'center', marginRight: spacing.md },
    categoryImageContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryImage: { width: '100%', height: '100%' },
    categoryName: { marginTop: spacing.xs, textAlign: 'center' },
    /* Banner */ banner: {
      height: 180,
      marginHorizontal: spacing.md,
      marginTop: spacing.lg,
      borderRadius: sizes.radiusLg,
      overflow: 'hidden',
    },
    bannerImage: { width: '100%', height: '100%' },
    bannerContent: { position: 'absolute', left: spacing.md, top: spacing.md },
    bannerSubtitle: { marginTop: spacing.xs },
    bannerButton: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: sizes.radiusSm,
      marginTop: spacing.md,
      alignSelf: 'flex-start',
    },
    /* Products */ productRow: {
      paddingHorizontal: spacing.md,
      justifyContent: 'space-between',
    },
    productCard: {
      width: '48%',
      backgroundColor: colors.surface,
      borderRadius: sizes.radiusMd,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    productImageContainer: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: colors.background,
    },
    productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    productContent: { padding: spacing.sm },
    ratingContainer: { marginTop: spacing.xs },
    ratingBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.success,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: sizes.radiusSm,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    originalPrice: {
      textDecorationLine: 'line-through',
      marginLeft: spacing.xs,
    },
    addButton: { marginTop: spacing.sm },
    /* Offers */ offerList: { paddingHorizontal: spacing.md },
    offerCard: {
      width: 280,
      height: 150,
      borderRadius: sizes.radiusLg,
      overflow: 'hidden',
      marginRight: spacing.md,
    },
    offerImage: { width: '100%', height: '100%' },
    offerOverlay: { position: 'absolute', left: spacing.md, top: spacing.md },
    offerSubtitle: { marginTop: spacing.xs },
    shopButton: {
      backgroundColor: colors.white,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: sizes.radiusSm,
      marginTop: spacing.sm,
    },
    /* Popular */ popularList: { paddingHorizontal: spacing.md },
    popularCard: {
      width: 150,
      backgroundColor: colors.surface,
      borderRadius: sizes.radiusMd,
      padding: spacing.sm,
      marginRight: spacing.md,
    },
    popularImage: {
      width: '100%',
      height: 130,
      borderRadius: sizes.radiusSm,
      resizeMode: 'cover',
    },
    popularPrice: { marginTop: spacing.xs },
  });
