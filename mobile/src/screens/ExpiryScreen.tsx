import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { getLotes, getProdutos } from '../services/stock';

interface Product {
  id: string;
  name: string;
  lot: string;
  expiry: string;
  daysLeft: number;
  qty: number;
}

type FilterKey = 'all' | '90' | '45';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: '90', label: 'Até 90 dias' },
  { key: '45', label: 'Até 45 dias' },
];

function getStatus(daysLeft: number): 'critical' | 'warning' {
  return daysLeft <= 45 ? 'critical' : 'warning';
}

function getStatusLabel(daysLeft: number): string {
  return daysLeft <= 45 ? 'Crítico 45 dias' : 'Alerta 90 dias';
}

function getStatusColors(status: 'critical' | 'warning') {
  if (status === 'critical') {
    return {
      bg: Colors.criticalBg,
      text: Colors.critical,
      border: Colors.criticalLight,
      accent: Colors.critical,
    };
  }
  return {
    bg: Colors.warningBg,
    text: Colors.warning,
    border: Colors.warningLight,
    accent: Colors.warning,
  };
}

function getUrgencyIcon(daysLeft: number): string {
  if (daysLeft <= 20) return 'alert-circle';
  if (daysLeft <= 45) return 'warning';
  return 'time';
}

export default function ExpiryScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [lotes, produtos] = await Promise.all([getLotes(), getProdutos()]);
      const nomePorProduto = new Map(produtos.map((p) => [p.id_produto, p.dc_produto]));
      setProducts(
        lotes.map((lote) => ({
          id: String(lote.id_lote),
          name: nomePorProduto.get(lote.id_produto) ?? `Produto #${lote.id_produto}`,
          lot: `LT${lote.id_lote}`,
          expiry: lote.dt_vencimento.replace(/-/g, '/'),
          daysLeft: Number(lote.dias_para_vencer),
          qty: Number(lote.quantidade_lote),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vencimentos.');
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = useMemo(() => {
    if (activeFilter === '45') return products.filter((p) => p.daysLeft <= 45);
    if (activeFilter === '90') return products.filter((p) => p.daysLeft <= 90);
    return products;
  }, [products, activeFilter]);

  const critical45 = products.filter((p) => p.daysLeft <= 45).length;

  const renderProduct = ({ item }: { item: Product }) => {
    const status = getStatus(item.daysLeft);
    const statusLabel = getStatusLabel(item.daysLeft);
    const colors = getStatusColors(status);
    const icon = getUrgencyIcon(item.daysLeft);

    return (
      <View style={[styles.card, { borderLeftColor: colors.accent, borderLeftWidth: 3 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.iconCircle, { backgroundColor: colors.bg }]}>
              <Ionicons name={icon as any} size={18} color={colors.text} />
            </View>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.lotText}>Lote: {item.lot}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <Text style={[styles.statusText, { color: colors.text }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardBody}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textTertiary} />
            <Text style={styles.infoLabel}>Vencimento</Text>
            <Text style={styles.infoValue}>{item.expiry}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="hourglass-outline" size={14} color={colors.text} />
            <Text style={styles.infoLabel}>Dias restantes</Text>
            <Text style={[styles.infoValueHighlight, { color: colors.text }]}>
              {item.daysLeft} dias
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="cube-outline" size={14} color={Colors.textTertiary} />
            <Text style={styles.infoLabel}>Quantidade</Text>
            <Text style={styles.infoValue}>{item.qty} un.</Text>
          </View>
        </View>

        {/* Urgency bar */}
        <View style={styles.urgencyBar}>
          <View style={styles.urgencyTrack}>
            <View
              style={[
                styles.urgencyFill,
                {
                  width: `${Math.max(100 - (item.daysLeft / 90) * 100, 10)}%`,
                  backgroundColor: colors.accent,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Próximos do Vencimento</Text>
            <Text style={styles.headerSubtitle}>
              {critical45} produto{critical45 !== 1 ? 's' : ''} com vencimento em até 45 dias
            </Text>
          </View>
          <View style={styles.alertBadge}>
            <Ionicons name="time" size={18} color={Colors.critical} />
          </View>
        </View>

        {/* Segmented Filter */}
        <View style={styles.segmentedControl}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => setActiveFilter(filter.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {filter.label}
                </Text>
                {filter.key === '45' && (
                  <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                    <Text style={[styles.countText, isActive && styles.countTextActive]}>
                      {critical45}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Product List */}
      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyText}>Carregando vencimentos...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name={error ? 'cloud-offline-outline' : 'checkmark-circle-outline'}
                size={48}
                color={error ? Colors.critical : Colors.success}
              />
              <Text style={styles.emptyText}>{error ?? 'Nenhum produto neste período'}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 260,
  },
  alertBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.criticalBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  segmentActive: {
    backgroundColor: Colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: Colors.border,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  countTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    marginRight: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  lotText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
  },
  cardBody: {
    padding: 16,
    paddingTop: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  infoValueHighlight: {
    fontSize: 14,
    fontWeight: '700',
  },
  urgencyBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  urgencyTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  urgencyFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textTertiary,
  },
});
