import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ProgressBar, Surface, Text } from 'react-native-paper';
import { BORDER_RADIUS, CATEGORIES, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { useTransactions } from '../context/TransactionContext';

const { width } = Dimensions.get('window');
const PERIODS = ['Day', 'Week', 'Month', 'Year'];
const AnimatedProgressBar = Animated.createAnimatedComponent(ProgressBar);

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [progressAnim] = useState(new Animated.Value(0));
  const [expandedSection, setExpandedSection] = useState('spending');
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalSpent;
  const spendingRatio = totalIncome > 0 ? totalSpent / totalIncome : 0;
  
  // Calculate top spending categories
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {});
    
  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
    }));
    
  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
        <Surface style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <MaterialCommunityIcons name="eye-outline" size={22} color={COLORS.white} />
          </View>
          
          <Text style={styles.balanceAmount}>
            ${balance.toFixed(2)}
          </Text>
          
          <View style={styles.balanceRatio}>
            <View style={styles.ratioBar}>
              <AnimatedProgressBar 
                progress={progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, spendingRatio > 1 ? 1 : spendingRatio]
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
        </Surface>

        {/* Time Period Selector */}
        <View style={styles.periodFilterContainer}>
          <View style={styles.periodFilterHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
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
          </View>
          
          {/* Spending Statistics */}
          <Surface style={styles.statsCard}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => setExpandedSection(expandedSection === 'spending' ? null : 'spending')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeaderContent}>
                <View style={[styles.sectionIconContainer, { backgroundColor: COLORS.danger + '20' }]}>
                  <MaterialCommunityIcons name="chart-pie" size={20} color={COLORS.danger} />
                </View>
                <Text style={styles.statsCardTitle}>Spending Statistics</Text>
              </View>
              <MaterialCommunityIcons 
                name={expandedSection === 'spending' ? "chevron-up" : "chevron-down"} 
                size={24} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
            
            {expandedSection === 'spending' && (
              <View style={styles.statsContent}>
                <View style={styles.chartContainer}>
                  <View style={styles.doughnutChart}>
                    <View style={styles.doughnutInner}>
                      <Text style={styles.doughnutLabel}>Total Spent</Text>
                      <Text style={styles.doughnutAmount}>${totalSpent.toFixed(2)}</Text>
                    </View>
                    {topCategories.map((item, index) => (
                      <View 
                        key={item.category}
                        style={[
                          styles.doughnutSegment, 
                          { 
                            transform: [{ rotate: `${index * 120}deg` }], 
                            borderTopColor: getCategoryColor(item.category, index),
                            opacity: 0.85 - (index * 0.1)
                          }
                        ]} 
                      />
                    ))}
                  </View>
                </View>
                
                <View style={styles.categoriesList}>
                  {topCategories.length > 0 ? (
                    topCategories.map((item, index) => (
                      <View key={item.category} style={styles.categoryItem}>
                        <View style={styles.categoryHeader}>
                          <View style={styles.categoryNameContainer}>
                            <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(item.category, index) }]} />
                            <Text style={styles.categoryName}>{CATEGORIES[item.category]?.label || item.category}</Text>
                          </View>
                          <Text style={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</Text>
                        </View>
                        <AnimatedProgressBar 
                          progress={progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, item.percentage / 100]
                          })}
                          color={getCategoryColor(item.category, index)} 
                          style={styles.progressBar} 
                        />
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyCategories}>
                      <Text style={styles.emptyCategoriesText}>No expense data yet</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </Surface>
          
          {/* Recent Transactions */}
          <Surface style={styles.statsCard}>
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
                    <View 
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
                    </View>
                  ))
                )}
                
                {recentTransactions.length > 0 && (
                  <TouchableOpacity style={styles.viewAllContainer}>
                    <Text style={styles.viewAllText}>View All Transactions</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Surface>
          
          {/* Quick Actions */}
          <Surface style={styles.quickActionsCard}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionButton}>
                <View style={[styles.quickActionIcon, { backgroundColor: COLORS.danger + '20' }]}>
                  <MaterialCommunityIcons name="cash-minus" size={24} color={COLORS.danger} />
                </View>
                <Text style={styles.quickActionText}>Add Expense</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <View style={[styles.quickActionIcon, { backgroundColor: COLORS.success + '20' }]}>
                  <MaterialCommunityIcons name="cash-plus" size={24} color={COLORS.success} />
                </View>
                <Text style={styles.quickActionText}>Add Income</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary + '20' }]}>
                  <MaterialCommunityIcons name="chart-bar" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.quickActionText}>Reports</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <View style={[styles.quickActionIcon, { backgroundColor: COLORS.warning + '20' }]}>
                  <MaterialCommunityIcons name="cog" size={24} color={COLORS.warning} />
                </View>
                <Text style={styles.quickActionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper function to get category colors
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
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  balanceCard: {
    margin: SPACING.m,
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
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
    backgroundColor: COLORS.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  expenseIcon: {
    backgroundColor: COLORS.danger + '20',
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
  periodFilterContainer: {
    paddingHorizontal: SPACING.m,
    marginTop: SPACING.m,
  },
  periodFilterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  periodFilter: {
    flexDirection: 'row',
  },
  periodButton: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    marginLeft: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  selectedPeriod: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.textLight,
  },
  selectedPeriodText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  statsCard: {
    marginVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    overflow: 'hidden',
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
  chartContainer: {
    alignItems: 'center',
    marginVertical: SPACING.m,
  },
  doughnutChart: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: COLORS.background,
  },
  doughnutSegment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 90,
    borderWidth: 18,
    borderColor: 'transparent',
    borderTopColor: COLORS.primary,
  },
  doughnutInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
    zIndex: 1,
  },
  doughnutLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  doughnutAmount: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  categoriesList: {
    marginTop: SPACING.m,
  },
  categoryItem: {
    marginBottom: SPACING.m,
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
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.s,
  },
  categoryName: {
    ...FONTS.body,
    color: COLORS.text,
  },
  categoryPercentage: {
    ...FONTS.body,
    color: COLORS.textLight,
  },
  emptyCategories: {
    alignItems: 'center',
    paddingVertical: SPACING.l,
  },
  emptyCategoriesText: {
    ...FONTS.body,
    color: COLORS.textLight,
  },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
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
  },
  quickActionsCard: {
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  quickActionsTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    padding: SPACING.m,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.m,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  quickActionText: {
    ...FONTS.body,
    color: COLORS.text,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
});