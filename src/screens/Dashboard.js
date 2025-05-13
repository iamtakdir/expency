import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { BORDER_RADIUS, CATEGORIES, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { useTransactions } from '../context/TransactionContext';

const PERIODS = ['All', 'Daily', 'Weekly', 'Monthly'];

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [selectedPeriod, setSelectedPeriod] = useState('All');

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>David</Text>
          </View>
          <TouchableOpacity style={styles.notificationBell}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.periodFilter}>
          {PERIODS.map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriod,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.selectedPeriodText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Surface style={styles.statsCard}>
          <View style={styles.chartContainer}>
            <View style={styles.dummyChart}>
              <View style={styles.chartCenter}>
                <Text style={styles.balanceLabel}>Balance</Text>
                <Text style={styles.balanceAmount}>
                  ${(totalIncome - totalSpent).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={[styles.statAmount, { color: COLORS.success }]}>
                ${totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Spent</Text>
              <Text style={[styles.statAmount, { color: COLORS.danger }]}>
                ${totalSpent.toFixed(2)}
              </Text>
            </View>
          </View>
        </Surface>

        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {transactions.slice(0, 3).map(transaction => (
            <Surface key={transaction.id} style={styles.transactionCard}>
              <View style={[
                styles.categoryIcon,
                { backgroundColor: CATEGORIES[transaction.category]?.color + '20' }
              ]}>
                <MaterialCommunityIcons
                  name={CATEGORIES[transaction.category]?.icon || 'cash'}
                  size={24}
                  color={CATEGORIES[transaction.category]?.color}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {CATEGORIES[transaction.category]?.label || transaction.category}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? COLORS.success : COLORS.danger }
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </Text>
            </Surface>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.m,
    paddingTop: SPACING.xl,
  },
  greeting: {
    ...FONTS.body,
    color: COLORS.textLight,
  },
  name: {
    ...FONTS.h1,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  notificationBell: {
    padding: SPACING.s,
  },
  periodFilter: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  periodButton: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    marginRight: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.white,
  },
  selectedPeriod: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    ...FONTS.body,
    color: COLORS.textLight,
  },
  selectedPeriodText: {
    color: COLORS.white,
  },
  statsCard: {
    margin: SPACING.m,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  chartContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  dummyChart: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenter: {
    alignItems: 'center',
  },
  balanceLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  balanceAmount: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.m,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  statAmount: {
    ...FONTS.h2,
    marginTop: SPACING.xs,
  },
  transactionsSection: {
    padding: SPACING.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  seeAll: {
    ...FONTS.body,
    color: COLORS.primary,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  transactionTitle: {
    ...FONTS.body,
    color: COLORS.text,
  },
  transactionDate: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  transactionAmount: {
    ...FONTS.h2,
  },
}); 