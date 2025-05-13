import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, IconButton, Surface, Text, TextInput } from 'react-native-paper';
import CategoryPicker from '../components/CategoryPicker';
import { BORDER_RADIUS, CATEGORIES, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { useTransactions } from '../context/TransactionContext';

export default function Income() {
  const { addTransaction, updateTransaction, deleteTransaction, transactions } = useTransactions();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleAddIncome = () => {
    if (!amount || !description || !category) return;

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        ...editingTransaction,
        amount: parseFloat(amount),
        description,
        category,
      });
      setEditingTransaction(null);
    } else {
      addTransaction({
        type: 'income',
        amount: parseFloat(amount),
        description,
        category,
        date: new Date().toISOString(),
      });
    }

    setAmount('');
    setDescription('');
    setCategory('');
  };

  const handleEdit = (transaction) => {
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setCategory(transaction.category);
    setEditingTransaction(transaction);
    setMenuVisible(false);
  };

  const handleDelete = (transactionId) => {
    deleteTransaction(transactionId);
    setMenuVisible(false);
  };

  const openMenu = (transaction) => {
    setSelectedTransaction(transaction);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedTransaction(null);
  };

  const incomeTransactions = transactions
    .filter(t => t.type === 'income')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Surface style={styles.formCard}>
          <View style={styles.amountContainer}>
            <Text style={[styles.currencySymbol, { color: COLORS.success }]}>$</Text>
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
            type="income"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.success}
            textColor={COLORS.text}
          />

          <Button
            mode="contained"
            onPress={handleAddIncome}
            style={[
              styles.button,
              !amount || !description || !category ? { backgroundColor: COLORS.button.success.disabled } : null
            ]}
            disabled={!amount || !description || !category}
            buttonColor={COLORS.button.success.active}
            textColor={!amount || !description || !category ? COLORS.button.success.text.disabled : COLORS.button.success.text.active}
          >
            {editingTransaction ? 'Update Income' : 'Add Income'}
          </Button>
          
          {editingTransaction && (
            <Button
              mode="text"
              onPress={() => {
                setEditingTransaction(null);
                setAmount('');
                setDescription('');
                setCategory('');
              }}
              style={{ marginTop: SPACING.s }}
              textColor={COLORS.textLight}
            >
              Cancel Edit
            </Button>
          )}
        </Surface>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Income</Text>
          {incomeTransactions.slice(0, 5).map(transaction => (
            <Surface key={transaction.id} style={styles.transactionCard}>
              <View style={[
                styles.categoryIcon,
                { backgroundColor: CATEGORIES[transaction.category]?.color || COLORS.success }
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
                +${parseFloat(transaction.amount).toFixed(2)}
              </Text>
              <View style={styles.actionButtons}>
                <IconButton
                  icon="pencil"
                  size={20}
                  iconColor={COLORS.primary}
                  onPress={() => {
                    setAmount(transaction.amount.toString());
                    setDescription(transaction.description);
                    setCategory(transaction.category);
                    setEditingTransaction(transaction);
                  }}
                  style={styles.actionButton}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  iconColor={COLORS.danger}
                  onPress={() => deleteTransaction(transaction.id)}
                  style={styles.actionButton}
                />
              </View>
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
    ...SHADOWS.small,
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
    color: COLORS.success,
  },
  amountInput: {
    ...FONTS.title,
    backgroundColor: 'transparent',
    textAlign: 'center',
    flex: 1,
    paddingVertical: SPACING.m,
    color: COLORS.text,
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
    borderRadius: BORDER_RADIUS.m,
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
    color: COLORS.success,
    marginRight: SPACING.s,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.s,
  },
  actionButton: {
    margin: 0,
    padding: 0,
    width: 32,
    height: 32,
  },
}); 