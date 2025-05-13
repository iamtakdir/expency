export const COLORS = {
  primary: '#4169E1',  // Royal Blue
  secondary: '#F8FAFC', // Very light blue-gray background
  white: '#FFFFFF',
  black: '#000000',
  text: '#1A1A1A',
  textLight: '#94A3B8',
  success: '#22C55E',  // Softer green
  danger: '#EF4444',   // Softer red
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  disabled: {
    background: '#F1F5F9',  // Very light gray background
    text: '#334155',      // Much darker slate for better visibility
  },
  button: {
    primary: {
      active: '#4169E1',
      disabled: '#F1F5F9',
      text: {
        active: '#FFFFFF',
        disabled: '#334155'
      }
    },
    success: {
      active: '#22C55E',
      disabled: '#F1F5F9',
      text: {
        active: '#FFFFFF',
        disabled: '#334155'
      }
    },
    danger: {
      active: '#EF4444',
      disabled: '#F1F5F9',
      text: {
        active: '#FFFFFF',
        disabled: '#334155'
      }
    }
  },
  gradient: {
    primary: ['#4169E1', '#5C85E8'],
    success: ['#22C55E', '#16A34A'],
    danger: ['#EF4444', '#DC2626']
  }
};

export const CATEGORIES = {
  // Expense Categories
  food: {
    icon: 'food',
    color: '#FF6B6B',
    label: 'Food'
  },
  shopping: {
    icon: 'shopping',
    color: '#4ECDC4',
    label: 'Shopping'
  },
  transport: {
    icon: 'car',
    color: '#45B7D1',
    label: 'Transport'
  },
  entertainment: {
    icon: 'movie',
    color: '#96CEB4',
    label: 'Entertainment'
  },
  health: {
    icon: 'medical-bag',
    color: '#FF7F50',
    label: 'Health'
  },
  utilities: {
    icon: 'lightning-bolt',
    color: '#FFB900',
    label: 'Utilities'
  },
  education: {
    icon: 'school',
    color: '#B19CD9',
    label: 'Education'
  },
  rent: {
    icon: 'home',
    color: '#FF9F43',
    label: 'Rent'
  },
  groceries: {
    icon: 'cart',
    color: '#00B894',
    label: 'Groceries'
  },
  gym: {
    icon: 'dumbbell',
    color: '#FC5C65',
    label: 'Gym'
  },
  // Income Categories
  salary: {
    icon: 'cash-multiple',
    color: '#2ecc71',
    label: 'Salary'
  },
  freelance: {
    icon: 'laptop',
    color: '#9B59B6',
    label: 'Freelance'
  },
  investment: {
    icon: 'chart-line',
    color: '#F1C40F',
    label: 'Investment'
  },
  business: {
    icon: 'store',
    color: '#3498DB',
    label: 'Business'
  },
  rental: {
    icon: 'home-city',
    color: '#E67E22',
    label: 'Rental'
  },
  dividend: {
    icon: 'cash-plus',
    color: '#27AE60',
    label: 'Dividend'
  },
  bonus: {
    icon: 'gift',
    color: '#8E44AD',
    label: 'Bonus'
  }
};

export const FONTS = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  body: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: 14,
    color: '#757575',
    letterSpacing: 0.2,
  },
  small: {
    fontSize: 12,
    letterSpacing: 0.2,
  }
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  }
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
}; 