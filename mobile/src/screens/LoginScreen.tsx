import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { login } from '../services/auth';

export default function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError('Preencha usuário e senha.');
      return;
    }

    setLoading(true);
    try {
      await login(trimmedUser, password);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Logo & Branding */}
          <View style={styles.topSection}>
            <View style={styles.logoInner}>
              <Ionicons name="cube" size={36} color="#FFFFFF" />
            </View>

            <Text style={styles.brandName}>StockPlus</Text>
            <Text style={styles.brandSuffix}>MOBILE</Text>

            <View style={styles.divider} />

            <Text style={styles.subtitle}>
              Controle de estoque para{'\n'}operações internas
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            {error !== '' && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.critical} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="rgba(255,255,255,0.5)"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Usuário"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                editable={!loading}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="rgba(255,255,255,0.5)"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Senha"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="rgba(255,255,255,0.5)"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Entrar</Text>
                  <View style={styles.loginButtonIcon}>
                    <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <Ionicons name="alert-circle-outline" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.featureText}>Alertas</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="calendar-outline" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.featureText}>Vencimentos</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="stats-chart-outline" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.featureText}>Visão geral</Text>
              </View>
            </View>
            <Text style={styles.version}>v1.0.0</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  decorCircle1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 120,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  // Top branding
  topSection: {
    alignItems: 'center',
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandSuffix: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 6,
    marginTop: 4,
  },
  divider: {
    width: 36,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: 20,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form
  formSection: {
    width: '100%',
    gap: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(220,38,38,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.3)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#FCA5A5',
    lineHeight: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    height: '100%',
  },
  passwordInput: {
    paddingRight: 36,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 14,
    gap: 10,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primary,
  },
  loginButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15,43,76,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  version: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
  },
});
