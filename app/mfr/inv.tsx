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

export default function ManufacturerInventory() {
  const [searchQuery, setSearchQuery] = useState('');

  const totalStock = batteries.reduce((sum, b) => sum + b.stock, 0);
  const lowStockItems = batteries.filter(b => b.status === 'low_stock').length;
  const outOfStockItems = batteries.filter(b => b.status === 'out_of_stock').length;
  const totalValue = batteries.reduce((sum, b) => sum + (b.price * b.stock), 0);

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
          value={totalStock}
          label="Total Units"
          colors={['#4F46E5', '#6366F1']}
        />
        <StatCard
          icon="warning"
          value={lowStockItems}
          label="Low Stock"
          colors={['#F59E0B', '#FBBF24']}
        />
        <StatCard
          icon="close-circle"
          value={outOfStockItems}
          label="Out of Stock"
          colors={['#EF4444', '#F87171']}
        />
        <StatCard
          icon="cash"
          value={`$${(totalValue / 1000).toFixed(0)}K`}
          label="Total Value"
          colors={['#10B981', '#34D399']}
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
        <Text style={styles.sectionTitle}>Inventory Items</Text>
        {filteredBatteries.map((battery) => (
          <View key={battery.id} style={styles.inventoryCard}>
            <View style={styles.inventoryHeader}>
              <View style={styles.batteryIcon}>
                <Ionicons name="battery-charging" size={28} color="#4F46E5" />
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
              </View>
            </View>

            <View style={styles.inventoryDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Stock Level</Text>
                <View style={styles.stockContainer}>
                  <Text style={[styles.stockValue, getStockColor(battery.status)]}>
                    {battery.stock} units
                  </Text>
                  <View style={[styles.statusDot, getStatusDotColor(battery.status)]} />
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>Warehouse A - Section {battery.id.slice(-1)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Unit Price</Text>
                <Text style={styles.detailValue}>${battery.price}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Value</Text>
                <Text style={styles.detailValueHighlight}>
                  ${(battery.price * battery.stock).toLocaleString()}
                </Text>
              </View>

              <View style={styles.productActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="add-circle-outline" size={18} color="#4F46E5" />
                  <Text style={styles.actionButtonText}>Restock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
                  <Ionicons name="create-outline" size={18} color="#6B7280" />
                  <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
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

function getStatusDotColor(status: string) {
  switch (status) {
    case 'available':
      return { backgroundColor: '#10B981' };
    case 'low_stock':
      return { backgroundColor: '#F59E0B' };
    case 'out_of_stock':
      return { backgroundColor: '#EF4444' };
    default:
      return { backgroundColor: '#6B7280' };
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inventoryHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  batteryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  inventoryDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  detailValueHighlight: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonSecondary: {
    backgroundColor: '#F9FAFB',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#6B7280',
  },
});
