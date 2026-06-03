import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

export default function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <View style={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 }]}>
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        {/* Top Section - Logo & Text */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoInner}>
              <Ionicons name="cube" size={40} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.brandName}>StockPlus</Text>
          <Text style={styles.brandSuffix}>MOBILE</Text>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>
            Controle de estoque para{'\n'}operações internas
          </Text>
        </View>

        {/* Bottom Section - CTA */}
        <View style={styles.bottomSection}>
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Ionicons name="alert-circle-outline" size={20} color="rgba(255,255,255,0.6)" />
              <Text style={styles.featureText}>Alertas de estoque</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.6)" />
              <Text style={styles.featureText}>Vencimentos</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="stats-chart-outline" size={20} color="rgba(255,255,255,0.6)" />
              <Text style={styles.featureText}>Visão geral</Text>
            </View>
          </View>

          <Text style={styles.description}>
            Acompanhe produtos críticos, vencimentos e o panorama geral do estoque.
          </Text>

          <TouchableOpacity
            style={styles.enterButton}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.85}
          >
            <Text style={styles.enterButtonText}>Entrar</Text>
            <View style={styles.enterButtonIcon}>
              <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Login será implementado futuramente
          </Text>

          <Text style={styles.version}>v1.0.0 — Protótipo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
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
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoInner: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  brandName: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandSuffix: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 6,
    marginTop: 4,
  },
  divider: {
    width: 36,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: 24,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    alignItems: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  featureItem: {
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    gap: 12,
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
  enterButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primary,
  },
  enterButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15,43,76,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 16,
    textAlign: 'center',
  },
  version: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    marginTop: 12,
  },
});
