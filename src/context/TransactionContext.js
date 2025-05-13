import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now().toString() }]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...updatedTransaction, id } : t
    ));
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  };

  const getExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  };

  const getBalance = () => {
    return getIncome() - getExpenses();
  };

  return (
    <TransactionContext.Provider 
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getIncome,
        getExpenses,
        getBalance
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
} 