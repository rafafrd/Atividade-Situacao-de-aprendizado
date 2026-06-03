import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  qty: number;
  min: number;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Arroz Tipo 1', sku: 'ARZ001', category: 'Grãos', qty: 8, min: 10 },
  { id: '2', name: 'Feijão Carioca', sku: 'FEJ014', category: 'Grãos', qty: 4, min: 8 },
  { id: '3', name: 'Óleo de Soja 900ml', sku: 'OLS022', category: 'Óleos', qty: 12, min: 12 },
  { id: '4', name: 'Macarrão Espaguete', sku: 'MAC101', category: 'Massas', qty: 3, min: 10 },
  { id: '5', name: 'Açúcar Refinado 1kg', sku: 'ACR055', category: 'Mercearia', qty: 15, min: 20 },
  { id: '6', name: 'Farinha de Trigo 1kg', sku: 'FRT033', category: 'Mercearia', qty: 2, min: 15 },
  { id: '7', name: 'Sal Refinado 1kg', sku: 'SAL008', category: 'Temperos', qty: 20, min: 20 },
];

type FilterKey = 'all' | 'critical' | 'attention';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'critical', label: 'Crítico' },
  { key: 'attention', label: 'Atenção' },
];

function getStatus(qty: number, min: number): 'critical' | 'attention' {
  return qty < min ? 'critical' : 'attention';
}

function getStatusLabel(status: 'critical' | 'attention'): string {
  return status === 'critical' ? 'Crítico' : 'Atenção';
}

function getStatusColors(status: 'critical' | 'attention') {
  if (status === 'critical') {
    return { bg: Colors.criticalBg, text: Colors.critical, border: Colors.criticalLight };
  }
  return { bg: Colors.attentionBg, text: Colors.attention, border: Colors.attentionLight };
}

export default function MinStockScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const criticalCount = PRODUCTS.filter((p) => p.qty < p.min).length;
  const attentionCount = PRODUCTS.filter((p) => p.qty >= p.min).length;

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());

      let matchFilter = true;
      if (activeFilter === 'critical') matchFilter = p.qty < p.min;
      if (activeFilter === 'attention') matchFilter = p.qty >= p.min;

      return matchSearch && matchFilter;
    });
  }, [search, activeFilter]);

  const renderProduct = ({ item }: { item: Product }) => {
    const status = getStatus(item.qty, item.min);
    const statusLabel = getStatusLabel(status);
    const colors = getStatusColors(status);
    const fillPercent = Math.min((item.qty / item.min) * 100, 100);
    const isCritical = status === 'critical';

    return (
      <View style={[styles.card, isCritical && styles.cardCritical]}>
        {/* Critical left accent */}
        {isCritical && <View style={styles.cardAccent} />}

        <View style={[styles.cardInner, isCritical && { paddingLeft: 12 }]}>
          <View style={styles.cardTop}>
            <View style={styles.cardInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{item.sku}</Text>
                </View>
                <View style={styles.metaDot} />
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
              <View style={[styles.statusDot, { backgroundColor: colors.text }]} />
              <Text style={[styles.statusText, { color: colors.text }]}>{statusLabel}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardBottom}>
            <View style={styles.qtySection}>
              <View style={styles.qtyBlock}>
                <Text style={styles.qtyLabel}>Atual</Text>
                <Text style={[styles.qtyValue, { color: colors.text }]}>{item.qty}</Text>
              </View>
              <View style={styles.qtyDividerVertical} />
              <View style={styles.qtyBlock}>
                <Text style={styles.qtyLabel}>Mínimo</Text>
                <Text style={styles.qtyValueMin}>{item.min}</Text>
              </View>
              <View style={styles.qtyDividerVertical} />
              <View style={styles.qtyBlock}>
                <Text style={styles.qtyLabel}>Diferença</Text>
                <Text style={[styles.qtyValue, { color: isCritical ? Colors.critical : Colors.textSecondary }]}>
                  {item.qty - item.min}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${fillPercent}%`,
                      backgroundColor: colors.text,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.text }]}>{Math.round(fillPercent)}%</Text>
            </View>
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
            <Text style={styles.headerTitle}>Estoque Mínimo</Text>
            <Text style={styles.headerSubtitle}>
              {criticalCount} produto{criticalCount !== 1 ? 's' : ''} abaixo do mínimo
            </Text>
          </View>
          <View style={styles.alertIcon}>
            <Ionicons name="warning" size={18} color={Colors.warning} />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou SKU..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Status Filter Tabs */}
        <View style={styles.segmentedControl}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            const count =
              filter.key === 'critical'
                ? criticalCount
                : filter.key === 'attention'
                ? attentionCount
                : PRODUCTS.length;

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
                <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                  <Text style={[styles.countText, isActive && styles.countTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        }
      />
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
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.attentionBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },

  // Segmented Control
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

  // List
  listContent: {
    padding: 16,
    gap: 12,
  },

  // Cards
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
  cardCritical: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.critical,
        shadowOpacity: 0.1,
      },
    }),
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.critical,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardInner: {
    paddingLeft: 0,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaChip: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textTertiary,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
  },
  cardBottom: {
    padding: 16,
    paddingTop: 12,
    gap: 10,
  },
  qtySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBlock: {
    flex: 1,
  },
  qtyLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  qtyValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  qtyValueMin: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  qtyDividerVertical: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
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
