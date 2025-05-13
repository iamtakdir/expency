import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { API_ENDPOINTS, API_URL, getHeaders } from '../config/api';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch all transactions for the logged-in user
  const fetchTransactions = async () => {
    console.log('fetchTransactions called, user:', user);
    if (!user) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      const sessionStr = await SecureStore.getItemAsync('auth_session');
      if (!sessionStr) {
        setTransactions([]);
        return;
      }
      const session = JSON.parse(sessionStr);
      if (!session?.access_token) {
        setTransactions([]);
        return;
      }
      console.log('Fetching income and expense transactions from API...');
      // Fetch income transactions
      const incomeResponse = await fetch(`${API_URL}${API_ENDPOINTS.DATA.INCOME}?userId=eq.${user.id}&order=created_at.desc`, {
        headers: getHeaders(session.access_token),
      });
      // Fetch expense transactions
      const expenseResponse = await fetch(`${API_URL}${API_ENDPOINTS.DATA.EXPENSE}?userId=eq.${user.id}&order=created_at.desc`, {
        headers: getHeaders(session.access_token),
      });
      if (!incomeResponse.ok || !expenseResponse.ok) {
        const incomeText = await incomeResponse.text();
        const expenseText = await expenseResponse.text();
        console.error('Income fetch error:', incomeResponse.status, incomeText);
        console.error('Expense fetch error:', expenseResponse.status, expenseText);
        throw new Error('Failed to fetch transactions');
      }
      const incomeData = await incomeResponse.json();
      const expenseData = await expenseResponse.json();
      // Combine and sort transactions
      const allTransactions = [
        ...incomeData.map(income => ({ ...income, type: 'income' })),
        ...expenseData.map(expense => ({ ...expense, type: 'expense' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Add a new transaction
  const addTransaction = async (type, data) => {
    console.log('addTransaction called', type, data, 'user:', user);
    if (!user) return { error: 'Not logged in' };
    const sessionStr = await SecureStore.getItemAsync('auth_session');
    if (!sessionStr) return { error: 'No session found' };
    const session = JSON.parse(sessionStr);
    if (!session?.access_token) return { error: 'No access token' };
    try {
      const endpoint = type === 'income' ? API_ENDPOINTS.DATA.INCOME : API_ENDPOINTS.DATA.EXPENSE;
      console.log('POST to', `${API_URL}${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(session.access_token),
        body: JSON.stringify({
          ...data,
          userId: user.id,
          created_at: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add transaction error:', response.status, errorText);
        throw new Error('Failed to add transaction');
      }
      await fetchTransactions();
      return { error: null };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { error };
    }
  };

  // Delete a transaction
  const deleteTransaction = async (type, id) => {
    console.log('deleteTransaction called', type, id, 'user:', user);
    if (!user) return { error: 'Not logged in' };
    const sessionStr = await SecureStore.getItemAsync('auth_session');
    if (!sessionStr) return { error: 'No session found' };
    const session = JSON.parse(sessionStr);
    if (!session?.access_token) return { error: 'No access token' };
    try {
      const endpoint = type === 'income' ? API_ENDPOINTS.DATA.INCOME : API_ENDPOINTS.DATA.EXPENSE;
      console.log('DELETE to', `${API_URL}${endpoint}?id=eq.${id}`);
      const response = await fetch(`${API_URL}${endpoint}?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(session.access_token),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete transaction error:', response.status, errorText);
        throw new Error('Failed to delete transaction');
      }
      await fetchTransactions();
      return { error: null };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { error };
    }
  };

  // Update a transaction
  const updateTransaction = async (type, id, updates) => {
    console.log('updateTransaction called', type, id, updates, 'user:', user);
    if (!user) return { error: 'Not logged in' };
    const sessionStr = await SecureStore.getItemAsync('auth_session');
    if (!sessionStr) return { error: 'No session found' };
    const session = JSON.parse(sessionStr);
    if (!session?.access_token) return { error: 'No access token' };
    try {
      const endpoint = type === 'income' ? API_ENDPOINTS.DATA.INCOME : API_ENDPOINTS.DATA.EXPENSE;
      console.log('PATCH to', `${API_URL}${endpoint}?id=eq.${id}`);
      const response = await fetch(`${API_URL}${endpoint}?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(session.access_token),
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update transaction error:', response.status, errorText);
        throw new Error('Failed to update transaction');
      }
      await fetchTransactions();
      return { error: null };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { error };
    }
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
        loading,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        fetchTransactions,
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
  return useContext(TransactionContext);
} 