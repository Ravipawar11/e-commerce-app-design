import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, CustomText } from '../../components/common';
import { colors, fonts, sizes, spacing } from '../../theme';
import { useCart } from '../../context/CartContext';

/* ---------------------------------- Data ----------------------------------- */
const ALL_PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 1999,
    originalPrice: 2999,
    discount: '33% OFF',
    rating: '4.5',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    id: '2',
    name: 'Running Shoes',
    price: 2499,
    originalPrice: 3999,
    discount: '37% OFF',
    rating: '4.6',
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 3499,
    originalPrice: 4999,
    discount: '30% OFF',
    rating: '4.4',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
  {
    id: '4',
    name: 'Casual Backpack',
    price: 1299,
    originalPrice: 1999,
    discount: '35% OFF',
    rating: '4.3',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
  },
  {
    id: '5',
    name: 'Sunglasses',
    price: 899,
    originalPrice: 1499,
    discount: '40% OFF',
    rating: '4.2',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
  },
  {
    id: '6',
    name: 'Bluetooth Speaker',
    price: 1799,
    originalPrice: 2499,
    discount: '28% OFF',
    rating: '4.7',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
  },
  {
    id: '7',
    name: 'Leather Wallet',
    price: 699,
    originalPrice: 999,
    discount: '30% OFF',
    rating: '4.1',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
  },
  {
    id: '8',
    name: 'Yoga Mat',
    price: 599,
    originalPrice: 899,
    discount: '33% OFF',
    rating: '4.4',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500',
  },
];

const CATEGORIES = ['All', 'Fashion', 'Electronics', 'Shoes', 'Sports'];

const SORT_OPTIONS = [
  { key: 'popular', label: 'Popular', icon: 'flame-outline' },
  { key: 'price_low', label: 'Price: Low to High', icon: 'arrow-up-outline' },
  { key: 'price_high', label: 'Price: High to Low', icon: 'arrow-down-outline' },
  { key: 'rating', label: 'Top Rated', icon: 'star-outline' },
];

/* ---------------------------------- Component ----------------------------------- */
export const ProductsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [filterVisible, setFilterVisible] = useState(false);
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  /* ------------------------- Render Product Card ------------------------- */
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="heart-outline" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.discountBadge}>
          <CustomText variant="bold" size={10} color={colors.white}>
            {item.discount}
          </CustomText>
        </View>
      </View>

      <View style={styles.productContent}>
        <CustomText
          variant="medium"
          size={sizes.sm}
          color={colors.textPrimary}
          numberOfLines={2}
        >
          {item.name}
        </CustomText>

        <View style={styles.ratingRow}>
          <View style={styles.ratingBadge}>
            <Icon name="star" size={10} color={colors.white} />
            <CustomText
              variant="semibold"
              size={sizes.xs}
              color={colors.white}
              style={{ marginLeft: 2 }}
            >
              {item.rating}
            </CustomText>
          </View>
          <CustomText
            variant="regular"
            size={10}
            color={colors.textMuted}
            style={{ marginLeft: spacing.xs }}
          >
            (120)
          </CustomText>
        </View>

        <View style={styles.priceRow}>
          <CustomText variant="bold" size={sizes.md} color={colors.textPrimary}>
            ₹{item.price.toLocaleString('en-IN')}
          </CustomText>
          <CustomText
            variant="regular"
            size={sizes.xs}
            color={colors.textMuted}
            style={styles.originalPrice}
          >
            ₹{item.originalPrice.toLocaleString('en-IN')}
          </CustomText>
        </View>

        <CustomButton
          title="Add to Cart"
          icon="cart-outline"
          onPress={() =>{addToCart(item)
          Alert.alert(
            "Added to cart ",
            `${item.name} has been added to your cart`
          )
          }} 
          style={styles.addButton}
          size="sm"
        />
      </View>
    </TouchableOpacity>
  );

  /* ------------------------- Render Category Chip ------------------------- */
const renderCategoryChip = (category) => {
  const isActive = selectedCategory === category;
  return (
    <TouchableOpacity
      key={category}
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={() => setSelectedCategory(category)}
      activeOpacity={0.8}
    >
      <CustomText
        variant="semibold"
        size={sizes.xs}
        color={isActive ? colors.textWhite : colors.textPrimary}
        numberOfLines={1}
      >
        {category}
      </CustomText>
    </TouchableOpacity>
  );
};
  /* ------------------------- Render Empty State ------------------------- */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="search-outline" size={64} color={colors.textMuted} />
      <CustomText
        variant="semibold"
        size={sizes.md}
        color={colors.textPrimary}
        style={{ marginTop: spacing.md }}
      >
        No products found
      </CustomText>
      <CustomText
        variant="regular"
        size={sizes.sm}
        color={colors.textMuted}
        style={{ marginTop: spacing.xs, textAlign: 'center' }}
      >
        Try adjusting your search or filter
      </CustomText>
    </View>
  );

  /* ------------------------- Sort Modal ------------------------- */
  const renderSortModal = () => (
    <Modal
      visible={filterVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setFilterVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setFilterVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <CustomText variant="bold" size={sizes.lg} color={colors.textPrimary}>
              Sort By
            </CustomText>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Icon name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {SORT_OPTIONS.map(option => {
              const isActive = sortBy === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.sortOption, isActive && styles.sortOptionActive]}
                  onPress={() => {
                    setSortBy(option.key);
                    setFilterVisible(false);
                  }}
                >
                  <Icon
                    name={option.icon}
                    size={20}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                  <CustomText
                    variant={isActive ? 'semibold' : 'regular'}
                    size={sizes.sm}
                    color={isActive ? colors.primary : colors.textPrimary}
                    style={{ marginLeft: spacing.md, flex: 1 }}
                  >
                    {option.label}
                  </CustomText>
                  {isActive && (
                    <Icon name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <CustomButton
            title="Apply"
            onPress={() => setFilterVisible(false)}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  /* ------------------------- Main Render ------------------------- */
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Icon name="options-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipList}
      >
        {CATEGORIES.map(renderCategoryChip)}
      </ScrollView>

      {/* Results count + sort indicator */}
      <View style={styles.resultsRow}>
        <CustomText variant="medium" size={sizes.xs} color={colors.textSecondary}>
          {filteredProducts.length} products
        </CustomText>
        <TouchableOpacity
          style={styles.sortInline}
          onPress={() => setFilterVisible(true)}
        >
          <Icon name="swap-vertical-outline" size={14} color={colors.primary} />
          <CustomText
            variant="semibold"
            size={sizes.xs}
            color={colors.primary}
            style={{ marginLeft: 4 }}
          >
            {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />

      {renderSortModal()}
    </View>
  );
};

/* ---------------------------------- Styles ----------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  /* Search */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: sizes.radiusMd,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: fonts.family.regular,
    fontSize: sizes.sm,
    color: colors.textPrimary,
    padding: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: sizes.radiusMd,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Chips */
  chipList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  chip: {
  height: 36,                       // ← FIXED HEIGHT
  minWidth: 72,                     // optional: stops short labels like "All" from being tiny
  paddingHorizontal: spacing.md, 
 marginBottom : spacing.md,   // ← keep horizontal padding only, remove vertical
  borderRadius: 18,                 // ← half the height = perfect pill
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  alignItems: 'center',             // ← vertically centers the text
  justifyContent: 'center',         // ← horizontally centers the text
},
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  /* Results row */
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  sortInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Product grid */
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  productRow: {
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
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffffEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: sizes.radiusSm,
  },
  productContent: { padding: spacing.sm },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: sizes.radiusSm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  addButton: { marginTop: spacing.sm },

  /* Empty */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: sizes.radiusLg,
    borderTopRightRadius: sizes.radiusLg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: sizes.radiusMd,
  },
  sortOptionActive: {
    backgroundColor: colors.background,
  },
});