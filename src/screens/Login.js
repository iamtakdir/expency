import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email');
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      const { error } = await signIn({ email, password });
      if (error) {
        setErrorMessage(error);
        Alert.alert('Login Failed', error);
        return;
      }
      // On successful login, AuthContext will handle session
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    } catch (error) {
      setErrorMessage(error.message || 'Please check your credentials');
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <Surface style={styles.formCard}>
          {/* Error message rendering */}
          {errorMessage ? <Text style={{ color: COLORS.danger, marginBottom: 8 }}>{errorMessage}</Text> : null}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            textColor={COLORS.text}
            theme={{
              colors: {
                onSurfaceVariant: COLORS.textLight,
              },
            }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            textColor={COLORS.text}
            theme={{
              colors: {
                onSurfaceVariant: COLORS.textLight,
              },
            }}
          />          {isLoading ? (
            <View style={styles.button}>
              <ActivityIndicator color={COLORS.white} />
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Signup')}
              textColor={COLORS.primary}
              labelStyle={styles.linkText}
            >
              Sign Up
            </Button>
          </View>
        </Surface>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  formCard: {
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    width: '100%',
  },
  input: {
    marginBottom: SPACING.m,
    backgroundColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.m,
  },
  footerText: {
    ...FONTS.body,
    color: COLORS.textLight,
  },
  linkText: {
    ...FONTS.body,
    fontWeight: '600',
  },
});
