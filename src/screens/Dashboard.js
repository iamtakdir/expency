import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { FAB, ProgressBar, Surface, Text } from 'react-native-paper';
import { BORDER_RADIUS, CATEGORIES, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { useTransactions } from '../context/TransactionContext';

const { width } = Dimensions.get('window');
const AnimatedProgressBar = Animated.createAnimatedComponent(ProgressBar);
const AnimatedSurface = Animated.createAnimatedComponent(Surface);

export default function Dashboard() {
  const navigation = useNavigation();
  const { transactions } = useTransactions();
  const [progressAnim] = useState(new Animated.Value(0));
  const [expandedSection, setExpandedSection] = useState('spending');
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animate progress bars
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Animate cards with fade and slide up effect
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  // Calculate financial summaries
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalSpent;
  const spendingRatio = totalIncome > 0 ? totalSpent / totalIncome : 0;

  // Get this month's transactions
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);
  
  // Calculate this month's income and expenses
  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate trends (month over month)
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const startOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
  const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  
  const previousMonthTransactions = transactions.filter(
    t => {
      const date = new Date(t.date);
      return date >= startOfPreviousMonth && date <= endOfPreviousMonth;
    }
  );
  
  const previousMonthExpenses = previousMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenseTrend = previousMonthExpenses > 0 
    ? ((thisMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
    : 0;

  // Category breakdown
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += transaction.amount;
      return acc;
    }, {});

  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }));

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Header with greeting and profile */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>David</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.text} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Balance Card */}
        <AnimatedSurface 
          style={[
            styles.balanceCard, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }
          ]}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <MaterialCommunityIcons name="eye-outline" size={22} color={COLORS.white} />
          </View>

          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>

          <View style={styles.balanceRatio}>
            <View style={styles.ratioBar}>
              <AnimatedProgressBar
                progress={progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, spendingRatio > 1 ? 1 : spendingRatio],
                })}
                color={spendingRatio > 0.8 ? COLORS.danger : COLORS.success}
                style={styles.progressBar}
              />
            </View>
            <Text style={styles.ratioText}>
              {spendingRatio <= 1
                ? `${(spendingRatio * 100).toFixed(0)}% of income spent`
                : `${((spendingRatio - 1) * 100).toFixed(0)}% over budget`}
            </Text>
          </View>

          <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
              <View style={styles.statIconContainer}>
                <MaterialCommunityIcons name="arrow-down" size={16} color={COLORS.success} />
              </View>
              <View>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={styles.statAmount}>${totalIncome.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.balanceStatItem}>
              <View style={[styles.statIconContainer, styles.expenseIcon]}>
                <MaterialCommunityIcons name="arrow-up" size={16} color={COLORS.danger} />
              </View>
              <View>
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={styles.statAmount}>${totalSpent.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </AnimatedSurface>

        {/* Monthly Summary Cards */}
        <View style={styles.monthlyCardsContainer}>
          <AnimatedSurface 
            style={[
              styles.monthlySummaryCard,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateY }]
              }
            ]}
          >
            <View style={styles.monthlySummaryHeader}>
              <MaterialCommunityIcons name="calendar-month" size={20} color={COLORS.primary} />
              <Text style={styles.monthlyTitle}>This Month</Text>
            </View>
            <View style={styles.monthlySummaryContent}>
              <View style={styles.monthlySummaryItem}>
                <Text style={styles.monthlySummaryLabel}>Income</Text>
                <Text style={styles.monthlySummaryAmount}>${thisMonthIncome.toFixed(2)}</Text>
              </View>
              <View style={styles.monthlySummaryItem}>
                <Text style={styles.monthlySummaryLabel}>Expenses</Text>
                <Text style={styles.monthlySummaryAmount}>${thisMonthExpenses.toFixed(2)}</Text>
              </View>
            </View>
          </AnimatedSurface>

          <AnimatedSurface 
            style={[
              styles.monthlySummaryCard,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateY }]
              }
            ]}
          >
            <View style={styles.monthlySummaryHeader}>
              <MaterialCommunityIcons 
                name={expenseTrend > 0 ? "trending-up" : "trending-down"} 
                size={20} 
                color={expenseTrend > 0 ? COLORS.danger : COLORS.success} 
              />
              <Text style={styles.monthlyTitle}>Spending Trend</Text>
            </View>
            <View style={styles.trendContent}>
              <Text style={[
                styles.trendPercentage,
                { color: expenseTrend > 0 ? COLORS.danger : COLORS.success }
              ]}>
                {expenseTrend > 0 ? '+' : ''}{expenseTrend.toFixed(1)}%
              </Text>
              <Text style={styles.trendLabel}>vs last month</Text>
            </View>
          </AnimatedSurface>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>

          {/* Top Spending Categories */}
          <AnimatedSurface 
            style={[
              styles.statsCard,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateY }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => setExpandedSection(expandedSection === 'spending' ? null : 'spending')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeaderContent}>
                <View style={[styles.sectionIconContainer, { backgroundColor: COLORS.danger + '20' }]}>
                  <MaterialCommunityIcons name="chart-pie" size={20} color={COLORS.danger} />
                </View>
                <Text style={styles.statsCardTitle}>Top Spending Categories</Text>
              </View>
              <MaterialCommunityIcons 
                name={expandedSection === 'spending' ? "chevron-up" : "chevron-down"} 
                size={24} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
            
            {expandedSection === 'spending' && (
              <View style={styles.statsContent}>
                <View style={styles.categoriesList}>
                  {topCategories.length > 0 ? (
                    topCategories.map((item, index) => (
                      <View key={item.category} style={styles.categoryItem}>
                        <View style={styles.categoryHeader}>
                          <View style={styles.categoryNameContainer}>
                            <View style={[
                              styles.categoryIcon, 
                              { backgroundColor: getCategoryColor(item.category, index) + '20' }
                            ]}>
                              <MaterialCommunityIcons 
                                name={CATEGORIES[item.category]?.icon || 'cash-minus'} 
                                size={16} 
                                color={getCategoryColor(item.category, index)} 
                              />
                            </View>
                            <Text style={styles.categoryName}>{CATEGORIES[item.category]?.label || item.category}</Text>
                          </View>
                          <Text style={styles.categoryPercentage}>${item.amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.categoryProgressContainer}>
                          <AnimatedProgressBar 
                            progress={progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, item.percentage / 100]
                            })}
                            color={getCategoryColor(item.category, index)} 
                            style={styles.categoryProgress} 
                          />
                          <Text style={styles.categoryPercentageSmall}>{item.percentage.toFixed(1)}%</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyCategories}>
                      <MaterialCommunityIcons name="chart-arc" size={36} color={COLORS.textLight} />
                      <Text style={styles.emptyCategoriesText}>No expense data yet</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </AnimatedSurface>
          
          {/* Recent Transactions */}
          <AnimatedSurface 
            style={[
              styles.statsCard,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateY }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => setExpandedSection(expandedSection === 'transactions' ? null : 'transactions')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeaderContent}>
                <View style={[styles.sectionIconContainer, { backgroundColor: COLORS.primary + '20' }]}>
                  <MaterialCommunityIcons name="swap-horizontal" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.statsCardTitle}>Recent Transactions</Text>
              </View>
              <MaterialCommunityIcons 
                name={expandedSection === 'transactions' ? "chevron-up" : "chevron-down"} 
                size={24} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
            
            {expandedSection === 'transactions' && (
              <View style={styles.transactionsContainer}>
                {recentTransactions.length === 0 ? (
                  <View style={styles.emptyTransactions}>
                    <MaterialCommunityIcons name="currency-usd-off" size={36} color={COLORS.textLight} />
                    <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
                  </View>
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <TouchableOpacity 
                      key={transaction.id} 
                      style={[
                        styles.transactionItem, 
                        index !== recentTransactions.length - 1 && styles.transactionItemBorder
                      ]}
                    >
                      <View style={styles.transactionLeftContent}>
                        <View style={[
                          styles.transactionIcon,
                          { backgroundColor: CATEGORIES[transaction.category]?.color || 
                            (transaction.type === 'income' ? COLORS.success : COLORS.danger) }
                        ]}>
                          <MaterialCommunityIcons
                            name={CATEGORIES[transaction.category]?.icon || (transaction.type === 'income' ? 'cash-plus' : 'cash-minus')}
                            size={20}
                            color={COLORS.white}
                          />
                        </View>
                        <View style={styles.transactionDetails}>
                          <Text style={styles.transactionTitle}>{transaction.description}</Text>
                          <Text style={styles.transactionCategory}>
                            {CATEGORIES[transaction.category]?.label || transaction.category}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.transactionRightContent}>
                        <Text
                          style={[
                            styles.transactionAmount,
                            { color: transaction.type === 'income' ? COLORS.success : COLORS.danger }
                          ]}
                        >
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </Text>
                        <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
                
                {recentTransactions.length > 0 && (
                  <TouchableOpacity style={styles.viewAllContainer} onPress={() => {}}>
                    <Text style={styles.viewAllText}>View All Transactions</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </AnimatedSurface>
        </View>
      </ScrollView>
      
      {/* Quick Actions FABs */}
      <View style={styles.fabContainer}>
        <FAB
          style={[styles.fab, { backgroundColor: COLORS.danger }]}
          icon="cash-minus"
          label="Add Expense"
          color={COLORS.white}
          onPress={() => navigation.navigate('Expense')}
        />
        <FAB
          style={[styles.fab, { backgroundColor: COLORS.success }]}
          icon="cash-plus"
          label="Add Income"
          color={COLORS.white}
          onPress={() => navigation.navigate('Income')}
        />
      </View>
    </SafeAreaView>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getCategoryColor(category, index) {
  const fallbackColors = [COLORS.danger, COLORS.primary, COLORS.warning];
  return CATEGORIES[category]?.color || fallbackColors[index % fallbackColors.length];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for FAB
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    paddingTop: Platform.OS === 'ios' ? SPACING.m : SPACING.xl,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: SPACING.s,
    marginRight: SPACING.s,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  
  // Balance Card Styles
  balanceCard: {
    margin: SPACING.m,
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    ...FONTS.body,
    color: COLORS.white + '99',
  },
  balanceAmount: {
    ...FONTS.title,
    color: COLORS.white,
    marginVertical: SPACING.m,
  },
  balanceRatio: {
    marginBottom: SPACING.m,
  },
  ratioBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white + '30',
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  ratioText: {
    ...FONTS.caption,
    color: COLORS.white + '99',
    textAlign: 'right',
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.s,
  },
  balanceStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  expenseIcon: {
    backgroundColor: COLORS.white + '20',
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.white + '99',
  },
  statAmount: {
    ...FONTS.body,
    color: COLORS.white,
    fontWeight: '600',
  },
  
  // Monthly Summary Cards
  monthlyCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.m,
    justifyContent: 'space-between',
  },
  monthlySummaryCard: {
    width: '48%',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  monthlySummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  monthlyTitle: {
    ...FONTS.body,
    fontWeight: '600',
    marginLeft: SPACING.xs,
    color: COLORS.text,
  },
  monthlySummaryContent: {
    marginTop: SPACING.s,
  },
  monthlySummaryItem: {
    marginBottom: SPACING.s,
  },
  monthlySummaryLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  monthlySummaryAmount: {
    ...FONTS.body,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 2,
  },
  trendContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.s,
  },
  trendPercentage: {
    ...FONTS.h2,
    fontWeight: 'bold',
  },
  trendLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginTop: 4,
  },
  
  // Main Content
  contentContainer: {
    paddingHorizontal: SPACING.m,
    marginTop: SPACING.l,
  },
  statsCard: {
    marginVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    overflow: 'hidden',
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  statsCardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  statsContent: {
    padding: SPACING.m,
    paddingTop: 0,
  },
  
  // Categories
  categoriesList: {
    marginTop: SPACING.s,
  },
  categoryItem: {
    marginBottom: SPACING.l,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  categoryName: {
    ...FONTS.body,
    color: COLORS.text,
  },
  categoryPercentage: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  categoryProgress: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginRight: SPACING.s,
  },
  categoryPercentageSmall: {
    ...FONTS.caption,
    color: COLORS.textLight,
    minWidth: 35,
    textAlign: 'right',
  },
  emptyCategories: {
    alignItems: 'center',
    paddingVertical: SPACING.l,
  },
  emptyCategoriesText: {
    ...FONTS.body,
    color: COLORS.textLight,
    marginTop: SPACING.s,
  },
  
  // Transactions
  transactionsContainer: {
    paddingBottom: SPACING.s,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  transactionLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
    ...SHADOWS.small,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    ...FONTS.body,
    color: COLORS.text,
    fontWeight: '500',
  },
  transactionCategory: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginTop: 2,
  },
  transactionRightContent: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...FONTS.body,
    fontWeight: '600',
  },
  transactionDate: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginTop: 2,
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyTransactionsText: {
    ...FONTS.body,
    color: COLORS.textLight,
    marginTop: SPACING.s,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  viewAllText: {
    ...FONTS.body,
    color: COLORS.primary,
    marginRight: SPACING.xs,
    fontWeight: '500',
  },
  
  // Floating Action Buttons
  fabContainer: {
    position: 'absolute',
    bottom: SPACING.m,
    left: SPACING.m,
    right: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fab: {
    margin: SPACING.xs,
    elevation: 6,
    flex: 1,
  },
  
  // Section Titles
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
});