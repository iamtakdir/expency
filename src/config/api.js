const API_URL = 'https://kufnaslatxucdhsuuoar.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Zm5hc2xhdHh1Y2Roc3V1b2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjc5OTcsImV4cCI6MjA2MjY0Mzk5N30.Pda-IX0JWULX4pYosI6ahnS0ltl2XKoMXreFsA-Vbyg';

export const getHeaders = (token = null) => {
  const headers = {
    'apikey': API_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };
  // Do not send Authorization header when RLS is disabled
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }
  return headers;
};

export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: '/auth/v1/signup',
    SIGN_IN: '/auth/v1/token?grant_type=password',
    SIGN_OUT: '/auth/v1/logout',
    GET_USER: '/auth/v1/user',
    REFRESH_TOKEN: '/auth/v1/token?grant_type=refresh_token',
  },
  DATA: {
    INCOME: '/rest/v1/income',
    EXPENSE: '/rest/v1/expanse',
  },
};

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || data.msg || 'An error occurred');
  }
  
  return data;
};

export { API_URL };

