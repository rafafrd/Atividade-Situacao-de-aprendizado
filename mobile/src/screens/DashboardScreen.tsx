import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';

interface SummaryCard {
  id: string;
  title: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
}

interface AlertItem {
  id: string;
  text: string;
  icon: string;
  color: string;
  bgColor: string;
  tab: string;
}

interface Shortcut {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
  tab: string;
}

const SUMMARY_CARDS: SummaryCard[] = [
  {
    id: '1',
    title: 'Total de Produtos',
    value: 128,
    icon: 'cube',
    color: Colors.primary,
    bgColor: Colors.primaryBg,
  },
  {
    id: '2',
    title: 'Estoque Crítico',
    value: 12,
    icon: 'warning',
    color: Colors.critical,
    bgColor: Colors.criticalBg,
  },
  {
    id: '3',
    title: 'Vencimentos Próximos',
    value: 8,
    icon: 'time',
    color: Colors.warning,
    bgColor: Colors.warningBg,
  },
];

const ALERTS: AlertItem[] = [
  {
    id: '1',
    text: '12 produtos abaixo do estoque mínimo',
    icon: 'alert-circle',
    color: Colors.critical,
    bgColor: Colors.criticalBg,
    tab: 'Estoque',
  },
  {
    id: '2',
    text: '5 produtos vencem em até 45 dias',
    icon: 'warning',
    color: Colors.warning,
    bgColor: Colors.warningBg,
    tab: 'Vencimentos',
  },
];

const SHORTCUTS: Shortcut[] = [
  {
    id: '1',
    title: 'Ver estoque mínimo',
    subtitle: 'Produtos abaixo do limite',
    icon: 'cube-outline',
    color: Colors.critical,
    bgColor: Colors.criticalBg,
    tab: 'Estoque',
  },
  {
    id: '2',
    title: 'Ver vencimentos',
    subtitle: 'Próximos do vencimento',
    icon: 'time-outline',
    color: Colors.warning,
    bgColor: Colors.warningBg,
    tab: 'Vencimentos',
  },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const now = new Date();
  const hours = now.getHours();
  const greeting =
    hours < 12 ? 'Bom dia' : hours < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.greetingText}>
                {greeting}, colaborador
              </Text>
              <Text style={styles.dateText}>
                {now.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.headerTitle}>Visão Geral do Estoque</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.cardsGrid}>
          {SUMMARY_CARDS.map((card) => (
            <View key={card.id} style={styles.summaryCard}>
              <View style={styles.summaryCardTop}>
                <View style={[styles.summaryIconBox, { backgroundColor: card.bgColor }]}>
                  <Ionicons name={card.icon as any} size={18} color={card.color} />
                </View>
              </View>
              <Text style={[styles.summaryValue, { color: card.color }]}>
                {card.value}
              </Text>
              <Text style={styles.summaryTitle}>{card.title}</Text>
            </View>
          ))}
        </View>

        {/* Alerts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.warning} />
              </View>
              <Text style={styles.sectionTitle}>Alertas Principais</Text>
            </View>
          </View>

          <View style={styles.alertsList}>
            {ALERTS.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={styles.alertCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(alert.tab)}
              >
                <View style={[styles.alertIconCircle, { backgroundColor: alert.bgColor }]}>
                  <Ionicons name={alert.icon as any} size={16} color={alert.color} />
                </View>
                <Text style={styles.alertText}>{alert.text}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Shortcuts */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="flash" size={16} color={Colors.accent} />
              </View>
              <Text style={styles.sectionTitle}>Atalhos Rápidos</Text>
            </View>
          </View>

          <View style={styles.shortcutsList}>
            {SHORTCUTS.map((shortcut) => (
              <TouchableOpacity
                key={shortcut.id}
                style={styles.shortcutCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(shortcut.tab)}
              >
                <View style={[styles.shortcutIcon, { backgroundColor: shortcut.bgColor }]}>
                  <Ionicons name={shortcut.icon as any} size={22} color={shortcut.color} />
                </View>
                <View style={styles.shortcutInfo}>
                  <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
                  <Text style={styles.shortcutSubtitle}>{shortcut.subtitle}</Text>
                </View>
                <View style={styles.shortcutArrow}>
                  <Ionicons name="arrow-forward" size={16} color={Colors.textTertiary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Last Update Footer */}
        <View style={styles.footerInfo}>
          <Ionicons name="sync-outline" size={13} color={Colors.textTertiary} />
          <Text style={styles.footerText}>
            Última atualização: {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
    textTransform: 'capitalize',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  // Summary Cards Grid
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flexBasis: '30%',
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryTitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    lineHeight: 15,
  },

  // Sections
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // Alerts
  alertsList: {
    gap: 8,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  alertIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    lineHeight: 20,
  },

  // Shortcuts
  shortcutsList: {
    gap: 10,
  },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  shortcutIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutInfo: {
    flex: 1,
  },
  shortcutTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  shortcutSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shortcutArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
