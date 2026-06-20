import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Button } from '@/components/Button';
import { signIn, resetPassword } from '@/services/auth';
import { useStore } from '@/store/useStore';
import { logScreenView } from '@/services/analytics';

interface LoginScreenProps {
  navigation: any;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useStore((s) => s.setUser);

  React.useEffect(() => {
    logScreenView('Login');
  }, []);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await signIn(email.trim(), password);
      setUser(user);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message ?? 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address first.');
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert('Email Sent', 'Check your inbox for password reset instructions.');
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'Could not send reset email.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Text style={styles.logoLetter}>A</Text>
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your training</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <Button title="Sign In" onPress={handleLogin} loading={loading} size="lg" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoMark: {
    width: 64,
    height: 64,
    backgroundColor: colors.accent,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoLetter: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 36,
    color: colors.background,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  forgot: {
    ...typography.bodySmall,
    color: colors.primaryLight,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.button,
    color: colors.accent,
  },
});
