import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { BORDER_RADIUS, CATEGORIES, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28; // Responsive width based on screen size

export default function CategoryPicker({ selectedCategory, onSelectCategory, type = 'expense' }) {
  const categories = Object.entries(CATEGORIES).filter(([key, value]) => {
    if (type === 'expense') {
      return !['salary', 'freelance', 'investment', 'business', 'rental', 'dividend', 'bonus'].includes(key);
    }
    return ['salary', 'freelance', 'investment', 'business', 'rental', 'dividend', 'bonus'].includes(key);
  });

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(([key, category]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.categoryItem,
            selectedCategory === key && styles.selectedItem,
            { backgroundColor: selectedCategory === key ? category.color : COLORS.white }
          ]}
          onPress={() => onSelectCategory(key)}
        >
          <View style={[
            styles.iconContainer, 
            { 
              backgroundColor: selectedCategory === key ? COLORS.white + '20' : category.color + '15'
            }
          ]}>
            <MaterialCommunityIcons
              name={category.icon}
              size={24}
              color={selectedCategory === key ? COLORS.white : category.color}
            />
          </View>
          <Text
            style={[
              styles.categoryLabel,
              { color: selectedCategory === key ? COLORS.white : COLORS.text }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    marginRight: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
  },
  selectedItem: {
    ...SHADOWS.medium,
    transform: [{ scale: 1.02 }],
  },
  iconContainer: {
    width: ITEM_WIDTH * 0.5,
    height: ITEM_WIDTH * 0.5,
    borderRadius: ITEM_WIDTH * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  categoryLabel: {
    ...FONTS.small,
    fontWeight: '600',
    marginTop: SPACING.xs,
    textAlign: 'center',
    width: '100%',
  },
}); 