import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import CategoryPicker from '../components/CategoryPicker';
import { BORDER_RADIUS, CATEGORIES, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { useTransactions } from '../context/TransactionContext';

export default function Expense() {
  const { addTransaction, transactions } = useTransactions();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleAddExpense = () => {
    if (!amount || !description || !category) return;

    addTransaction({
      type: 'expense',
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
    });

    setAmount('');
    setDescription('');
    setCategory('');
  };

  const expenseTransactions = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
   
     

        <Surface style={styles.formCard}>
          <View style={styles.amountContainer}>
            <Text style={[styles.currencySymbol, { color: COLORS.danger }]}>$</Text>
            <TextInput
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.amountInput, { fontSize: amount ? FONTS.title.fontSize : FONTS.h1.fontSize }]}
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              textColor={COLORS.text}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <Text style={[styles.sectionTitle, { marginTop: SPACING.l }]}>Category</Text>
          <CategoryPicker
            selectedCategory={category}
            onSelectCategory={setCategory}
            type="expense"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.danger}
            textColor={COLORS.text}
          />

          <Button
            mode="contained"
            onPress={handleAddExpense}
            style={styles.button}
            disabled={!amount || !description || !category}
            buttonColor={!amount || !description || !category ? COLORS.disabled.background : COLORS.danger}
            textColor={!amount || !description || !category ? COLORS.disabled.text : COLORS.white}
          >
            Add Expense
          </Button>
        </Surface>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenseTransactions.slice(0, 5).map(transaction => (
            <Surface key={transaction.id} style={styles.transactionCard}>
              <View style={[
                styles.categoryIcon,
                { backgroundColor: CATEGORIES[transaction.category]?.color || COLORS.primary }
              ]}>
                <MaterialCommunityIcons
                  name={CATEGORIES[transaction.category]?.icon || 'cash'}
                  size={24}
                  color={COLORS.white}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>
                -${parseFloat(transaction.amount).toFixed(2)}
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
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
  },
  backButton: {
    marginLeft: SPACING.s,
  },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    marginLeft: SPACING.m,
  },
  formCard: {
    margin: SPACING.m,
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.l,
  },
  currencySymbol: {
    ...FONTS.h1,
    marginRight: SPACING.xs,
  },
  amountInput: {
    ...FONTS.title,
    backgroundColor: 'transparent',
    textAlign: 'center',
    flex: 1,
    paddingVertical: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.m,
    marginLeft: SPACING.s,
  },
  input: {
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.white,
  },
  button: {
    marginTop: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    paddingVertical: SPACING.s,
  },
  section: {
    padding: SPACING.m,
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
    color: COLORS.danger,
  },
}); 