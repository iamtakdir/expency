import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { BORDER_RADIUS, CATEGORIES, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28; // Slightly wider for better text display

export default function CategoryPicker({ selectedCategory, onSelectCategory, type = 'expense' }) {
  const categories = Object.entries(CATEGORIES).filter(([key, value]) => {
    if (type === 'expense') {
      return !['salary', 'freelance', 'investment', 'business', 'rental', 'dividend', 'bonus'].includes(key);
    }
    return ['salary', 'freelance', 'investment', 'business', 'rental', 'dividend', 'bonus'].includes(key);
  });

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + SPACING.m}
        snapToAlignment="start"
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
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer, 
              { 
                backgroundColor: selectedCategory === key ? COLORS.white + '30' : category.color + '15'
              }
            ]}>
              <MaterialCommunityIcons
                name={category.icon}
                size={28}
                color={selectedCategory === key ? COLORS.white : category.color}
              />
            </View>
            <View style={styles.labelContainer}>
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
            </View>
            {selectedCategory === key && (
              <View style={styles.checkmark}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.white}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: SPACING.m,
  },
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
    height: ITEM_WIDTH * 1.25,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedItem: {
    ...SHADOWS.medium,
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: ITEM_WIDTH * 0.5,
    height: ITEM_WIDTH * 0.5,
    borderRadius: ITEM_WIDTH * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  labelContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  categoryLabel: {
    ...FONTS.body,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  checkmark: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
  }
}); 