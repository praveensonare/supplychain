import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '@/components/StatCard';

import { batteries } from '@/utils/dummyData';

export default function SellerInventory() {
  const [searchQuery, setSearchQuery] = useState('');

  const availableBatteries = batteries.filter(b => b.status === 'available');
  const lowStockItems = batteries.filter(b => b.status === 'low_stock').length;
  const totalItems = batteries.length;

  const filteredBatteries = batteries.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="cube"
          value={totalItems}
          label="Total Items"
          colors={['#4F46E5', '#6366F1']}
        />
        <StatCard
          icon="checkmark-circle"
          value={availableBatteries.length}
          label="Available"
          colors={['#10B981', '#34D399']}
        />
        <StatCard
          icon="warning"
          value={lowStockItems}
          label="Low Stock"
          colors={['#F59E0B', '#FBBF24']}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search inventory..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Inventory List */}
      <View style={styles.inventoryList}>
        <Text style={styles.sectionTitle}>Available Products</Text>
        {filteredBatteries.map((battery) => (
          <View key={battery.id} style={styles.inventoryCard}>
            <View style={styles.batteryIcon}>
              <Ionicons name="battery-charging" size={32} color="#4F46E5" />
            </View>
            <View style={styles.inventoryInfo}>
              <Text style={styles.inventoryName}>{battery.name}</Text>
              <Text style={styles.inventoryType}>{battery.type}</Text>
              <View style={styles.inventorySpecs}>
                <View style={styles.specChip}>
                  <Ionicons name="flash" size={12} color="#6B7280" />
                  <Text style={styles.specText}>{battery.capacity}</Text>
                </View>
                <View style={styles.specChip}>
                  <Ionicons name="speedometer" size={12} color="#6B7280" />
                  <Text style={styles.specText}>{battery.voltage}</Text>
                </View>
              </View>
              <View style={styles.inventoryMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Stock:</Text>
                  <Text style={[styles.metaValue, getStockColor(battery.status)]}>
                    {battery.stock} units
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Location:</Text>
                  <Text style={styles.metaValue}>Warehouse A-{battery.id.slice(-1)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.inventoryPricing}>
              <Text style={styles.inventoryPrice}>${battery.price}</Text>
              <Text style={styles.inventoryPriceLabel}>per unit</Text>
              <TouchableOpacity style={styles.orderButton}>
                <Ionicons name="cart" size={16} color="#fff" />
                <Text style={styles.orderButtonText}>Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function getStockColor(status: string) {
  switch (status) {
    case 'available':
      return { color: '#10B981' };
    case 'low_stock':
      return { color: '#F59E0B' };
    case 'out_of_stock':
      return { color: '#EF4444' };
    default:
      return { color: '#6B7280' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  inventoryList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  inventoryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 16,
  },
  batteryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  inventoryType: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  inventorySpecs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  specText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  inventoryMeta: {
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metaValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  inventoryPricing: {
    alignItems: 'flex-end',
  },
  inventoryPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 2,
  },
  inventoryPriceLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 12,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
