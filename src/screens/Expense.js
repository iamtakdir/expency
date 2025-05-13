import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, Surface, Text, TextInput } from 'react-native-paper';
import CategoryPicker from '../components/CategoryPicker';
import { BORDER_RADIUS, CATEGORIES, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { useTransactions } from '../context/TransactionContext';

export default function Expense() {
  const { addTransaction, updateTransaction, deleteTransaction, transactions } = useTransactions();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [expandedActionId, setExpandedActionId] = useState(null);

  const handleAddExpense = () => {
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
        type: 'expense',
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

  const handleEditPress = (transaction) => {
    setExpandedActionId(null);
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setCategory(transaction.category);
    setEditingTransaction(transaction);
  };

  const handleDeletePress = (transaction) => {
    setExpandedActionId(null);
    setTransactionToDelete(transaction);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      setDeleteDialogVisible(false);
    }
  };

  const toggleActionMenu = (id) => {
    setExpandedActionId(expandedActionId === id ? null : id);
  };

  const expenseTransactions = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const AddExpenseButton = () => (
    <TouchableOpacity 
      style={styles.addButton} 
      onPress={handleAddExpense}
      activeOpacity={0.8}
    >
      <Text style={styles.addButtonText}>Add Expense</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Surface style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>
                {editingTransaction ? 'Edit Expense' : 'New Expense'}
              </Text>
            </View>
            
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

            <Text style={styles.sectionTitle}>Category</Text>
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
              left={<TextInput.Icon icon="text" color={COLORS.textLight} />}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleAddExpense}
                style={styles.button}
                disabled={!amount || !description || !category}
                buttonColor={COLORS.button.danger.active}
                textColor={!amount || !description || !category ? COLORS.button.danger.text.disabled : COLORS.button.danger.text.active}
                icon={editingTransaction ? "pencil" : "plus"}
              >
                <Text style={
                  styles.addButtonText
                }>{editingTransaction ? 'Update Expense' : 'Add Expense'}</Text>
              </Button>

              {editingTransaction && (
                <Button
                  mode="outlined"
                  onPress={() => {
                    setEditingTransaction(null);
                    setAmount('');
                    setDescription('');
                    setCategory('');
                  }}
                  style={styles.cancelButton}
                  textColor={COLORS.danger}
                  icon="close"
                >
                  Cancel Edit
                </Button>
              )}
            </View>
          </Surface>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Expenses</Text>
              <Text style={styles.sectionSubtitle}>
                {expenseTransactions.length} {expenseTransactions.length === 1 ? 'transaction' : 'transactions'}
              </Text>
            </View>
            
            {expenseTransactions.length === 0 ? (
              <Surface style={styles.emptyState}>
                <MaterialCommunityIcons name="cash-remove" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyStateText}>No expenses yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your first expense above</Text>
              </Surface>
            ) : (
              expenseTransactions.slice(0, 5).map((transaction, index) => (
                <Surface 
                  key={transaction.id} 
                  style={[
                    styles.transactionCard, 
                    { marginBottom: index === expenseTransactions.length - 1 ? SPACING.xl : SPACING.m }
                  ]}
                >
                  <TouchableOpacity 
                    style={styles.transactionCardContent}
                    activeOpacity={0.8}
                    onPress={() => toggleActionMenu(transaction.id)}
                  >
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
                      <View style={styles.transactionMeta}>
                        <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textLight} />
                        <Text style={styles.transactionDate}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.transactionAmount}>
                      -${parseFloat(transaction.amount).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                  
                  {expandedActionId === transaction.id && (
                    <View style={styles.expandedActions}>
                      <TouchableOpacity
                        style={styles.expandedActionButton}
                        onPress={() => handleEditPress(transaction)}
                      >
                        <View style={styles.expandedActionIcon}>
                          <MaterialCommunityIcons name="pencil" size={18} color={COLORS.white} />
                        </View>
                        <Text style={styles.expandedActionText}>Edit</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.expandedActionButton, styles.deleteActionButton]}
                        onPress={() => handleDeletePress(transaction)}
                      >
                        <View style={[styles.expandedActionIcon, styles.deleteActionIcon]}>
                          <MaterialCommunityIcons name="delete" size={18} color={COLORS.white} />
                        </View>
                        <Text style={[styles.expandedActionText, styles.deleteActionText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Surface>
              ))
            )}
            
            {expenseTransactions.length > 5 && (
              <Button
                mode="text"
                onPress={() => {}}
                style={styles.viewAllButton}
                textColor={COLORS.primary}
                icon="chevron-right"
                contentStyle={{ flexDirection: 'row-reverse' }}
              >
                View All Expenses
              </Button>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this expense?</Paragraph>
            {transactionToDelete && (
              <View style={styles.dialogTransactionPreview}>
                <Text style={styles.dialogTransactionTitle}>{transactionToDelete.description}</Text>
                <Text style={styles.dialogTransactionAmount}>
                  ${parseFloat(transactionToDelete.amount).toFixed(2)}
                </Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete} textColor={COLORS.danger}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Ensure there's space at the bottom
  },
  formCard: {
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  formHeader: {
    backgroundColor: COLORS.danger + '15',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.danger + '20',
  },
  formHeaderText: {
    ...FONTS.h2,
    color: COLORS.danger,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
    paddingHorizontal: SPACING.l,
  },
  currencySymbol: {
    ...FONTS.h1,
    marginRight: SPACING.xs,
    fontWeight: 'bold',
  },
  amountInput: {
    ...FONTS.title,
    backgroundColor: 'transparent',
    textAlign: 'center',
    flex: 1,
    paddingVertical: SPACING.m,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.s,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.s,
    marginLeft: SPACING.s,
  },
  sectionSubtitle: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  input: {
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.s,
  },
  buttonContainer: {
    padding: SPACING.m,
  },
  button: {
    borderRadius: BORDER_RADIUS.m,
    paddingVertical: SPACING.s,
  },
  cancelButton: {
    marginTop: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    borderColor: COLORS.danger,
    borderWidth: 1,
  },
  section: {
    padding: SPACING.m,
  },
  transactionCard: {
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
    overflow: 'hidden',
    marginBottom: SPACING.m,
  },
  transactionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
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
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  transactionAmount: {
    ...FONTS.h3,
    color: COLORS.danger,
    fontWeight: 'bold',
    marginRight: SPACING.s,
  },
  expandedActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  expandedActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary + '10',
  },
  deleteActionButton: {
    backgroundColor: COLORS.danger + '10',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  expandedActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  deleteActionIcon: {
    backgroundColor: COLORS.danger,
  },
  expandedActionText: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  deleteActionText: {
    color: COLORS.danger,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.l,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  emptyStateText: {
    ...FONTS.h3,
    color: COLORS.textLight,
    marginTop: SPACING.m,
  },
  emptyStateSubtext: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  viewAllButton: {
    marginTop: SPACING.s,
    alignSelf: 'center',
  },
  dialogTransactionPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.m,
    padding: SPACING.m,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.m,
  },
  dialogTransactionTitle: {
    ...FONTS.body,
    color: COLORS.text,
    fontWeight: '600',
  },
  dialogTransactionAmount: {
    ...FONTS.body,
    color: COLORS.danger,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    ...FONTS.h4,
    color: COLORS.gray,
    fontWeight: '400',
    
  },
});