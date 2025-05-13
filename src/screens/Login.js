import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      // Demo login - no actual authentication
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <Surface style={styles.formCard}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
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
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            buttonColor={COLORS.primary}
            textColor={COLORS.white}
            disabled={!username || !password}
          >
            Login
          </Button>

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
    marginTop: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    paddingVertical: SPACING.xs,
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