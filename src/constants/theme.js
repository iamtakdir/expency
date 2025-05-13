export const COLORS = {
  primary: '#4361EE',  // Brighter royal blue
  secondary: '#F8FAFC', // Very light blue-gray background
  white: '#FFFFFF',
  black: '#000000',
  text: '#1E293B',     // Darker text for better contrast
  textLight: '#94A3B8',
  success: '#10B981',  // Vibrant green
  danger: '#EF4444',   // Vibrant red
  warning: '#F59E0B',  // Amber for warnings
  gray: '#DDDDDD',     // Gray for disabled text
  info: '#3B82F6',     // Blue for information
  background: '#F1F5F9', // Slightly darker background for better contrast
  card: '#FFFFFF',
  border: '#E2E8F0',
  disabled: {
    background: '#F1F5F9',
    text: '#64748B',
  },
  button: {
    primary: {
      active: '#4361EE',
      disabled: '#F1F5F9',
      text: {
        active: '#FFFFFF',
        disabled: '#64748B'
      }
    },
    success: {
      active: '#10B981',
      disabled: '#F1F5F9',
      text: {
        active: '#FFFFFF',
        disabled: '#64748B'
      }
    },
    danger: {
      active: '#EF4444',
      disabled: '#F1F5F9',
      text: {
        active: '#FFFFFF',
        disabled: '#64748B'
      }
    }
  },
  gradient: {
    primary: ['#4361EE', '#3B82F6'],
    success: ['#10B981', '#059669'],
    danger: ['#EF4444', '#DC2626']
  }
};

export const CATEGORIES = {
  // Expense Categories
  food: {
    icon: 'food',
    color: '#F87171',
    label: 'Food'
  },
  shopping: {
    icon: 'shopping',
    color: '#38BDF8',
    label: 'Shopping'
  },
  transport: {
    icon: 'car',
    color: '#818CF8',
    label: 'Transport'
  },
  entertainment: {
    icon: 'movie',
    color: '#C084FC',
    label: 'Entertainment'
  },
  health: {
    icon: 'medical-bag',
    color: '#FB7185',
    label: 'Health'
  },
  utilities: {
    icon: 'lightning-bolt',
    color: '#FBBF24',
    label: 'Utilities'
  },
  education: {
    icon: 'school',
    color: '#A78BFA',
    label: 'Education'
  },
  rent: {
    icon: 'home',
    color: '#FB923C',
    label: 'Rent'
  },
  groceries: {
    icon: 'cart',
    color: '#34D399',
    label: 'Groceries'
  },
  gym: {
    icon: 'dumbbell',
    color: '#F43F5E',
    label: 'Gym'
  },
  // Income Categories
  salary: {
    icon: 'cash-multiple',
    color: '#10B981',
    label: 'Salary'
  },
  freelance: {
    icon: 'laptop',
    color: '#8B5CF6',
    label: 'Freelance'
  },
  investment: {
    icon: 'chart-line',
    color: '#F59E0B',
    label: 'Investment'
  },
  business: {
    icon: 'store',
    color: '#3B82F6',
    label: 'Business'
  },
  rental: {
    icon: 'home-city',
    color: '#F97316',
    label: 'Rental'
  },
  dividend: {
    icon: 'cash-plus',
    color: '#22C55E',
    label: 'Dividend'
  },
  bonus: {
    icon: 'gift',
    color: '#A855F7',
    label: 'Bonus'
  }
};

export const FONTS = {
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  h1: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textLight,
    letterSpacing: 0.1,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.1,
  }
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.20,
    shadowRadius: 4.65,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.0,
    elevation: 12,
  }
};

export const SPACING = {
  none: 0,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  none: 0,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
};
