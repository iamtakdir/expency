import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { API_ENDPOINTS, API_URL, getHeaders } from '../config/api';

const AuthContext = createContext();

// Key for storing session in secure storage
const SESSION_KEY = 'auth_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  // Check for existing session
  async function checkSession() {
    try {
      setLoading(true);
      const sessionStr = await SecureStore.getItemAsync(SESSION_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.GET_USER}`, {
          headers: getHeaders(session.access_token),
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
        } else {
          throw new Error('Session invalid');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      await SecureStore.deleteItemAsync(SESSION_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Sign up with email and password
  async function signUp({ email, password }) {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.SIGN_UP}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || data.msg || 'Error signing up');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign in with email and password
  async function signIn({ email, password }) {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.SIGN_IN}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error?.message || data.msg || 'Invalid email or password';
        throw new Error(errorMessage);
      }

      // Verify that we have the required data
      if (!data.access_token || !data.user) {
        throw new Error('Invalid response from server');
      }

      // Store the session
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      }));

      // Set the user
      setUser(data.user);
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      // Clear any existing session data
      await SecureStore.deleteItemAsync(SESSION_KEY);
      setUser(null);
      return { 
        data: null, 
        error: error.message || 'Invalid email or password'
      };
    }
  }

  // Sign out
  async function signOut() {
    try {
      const sessionStr = await SecureStore.getItemAsync(SESSION_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        await fetch(`${API_URL}${API_ENDPOINTS.AUTH.SIGN_OUT}`, {
          method: 'POST',
          headers: getHeaders(session.access_token),
        });
      }
      
      await SecureStore.deleteItemAsync(SESSION_KEY);
      setUser(null);
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if the server request fails, clear the local session
      await SecureStore.deleteItemAsync(SESSION_KEY);
      setUser(null);
      return { error: error.message };
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
