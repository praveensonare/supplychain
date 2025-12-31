import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '@/components/StatCard';
import { batteries } from '@/utils/dummyData';

interface Battery {
  id: string;
  name: string;
  type: string;
  capacity: string;
  voltage: string;
  price: number;
  stock: number;
  status: string;
}

export default function ManufacturerInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const totalStock = batteries.reduce((sum, b) => sum + b.stock, 0);
  const lowStockItems = batteries.filter(b => b.status === 'low_stock').length;
  const outOfStockItems = batteries.filter(b => b.status === 'out_of_stock').length;
  const totalValue = batteries.reduce((sum, b) => sum + (b.price * b.stock), 0);

  // Add location and contact to batteries
  const locations = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Pune'];
  const batteriesWithLocation = batteries.map((b, index) => ({
    ...b,
    location: locations[index % locations.length],
    contact: `+91 ${9000000000 + index * 111111}`,
  }));

  const filteredBatteries = batteriesWithLocation.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || b.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

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

      {/* Search and Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, type, or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.filterRow}>
          {/* Status Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[styles.filterButton, statusFilter === 'all' && styles.filterButtonActive]}
                onPress={() => setStatusFilter('all')}
              >
                <Text style={[styles.filterButtonText, statusFilter === 'all' && styles.filterButtonTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, statusFilter === 'available' && styles.filterButtonActive]}
                onPress={() => setStatusFilter('available')}
              >
                <Text style={[styles.filterButtonText, statusFilter === 'available' && styles.filterButtonTextActive]}>Available</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, statusFilter === 'low_stock' && styles.filterButtonActive]}
                onPress={() => setStatusFilter('low_stock')}
              >
                <Text style={[styles.filterButtonText, statusFilter === 'low_stock' && styles.filterButtonTextActive]}>Low Stock</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Location:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[styles.filterButton, locationFilter === 'all' && styles.filterButtonActive]}
                onPress={() => setLocationFilter('all')}
              >
                <Text style={[styles.filterButtonText, locationFilter === 'all' && styles.filterButtonTextActive]}>All</Text>
              </TouchableOpacity>
              {locations.slice(0, 3).map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.filterButton, locationFilter === loc && styles.filterButtonActive]}
                  onPress={() => setLocationFilter(loc)}
                >
                  <Text style={[styles.filterButtonText, locationFilter === loc && styles.filterButtonTextActive]}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Inventory List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Inventory Items ({filteredBatteries.length})</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.col1]}>Product</Text>
          <Text style={[styles.tableHeaderText, styles.col2]}>Stock</Text>
          <Text style={[styles.tableHeaderText, styles.col3]}>Status</Text>
          <Text style={[styles.tableHeaderText, styles.col4]}>Location</Text>
          <Text style={[styles.tableHeaderText, styles.col5]}>Contact</Text>
          <Text style={[styles.tableHeaderText, styles.col6]}>Price</Text>
          <Text style={[styles.tableHeaderText, styles.col7]}>Actions</Text>
        </View>

        {/* Table Body */}
        {filteredBatteries.map((battery) => (
          <TouchableOpacity
            key={battery.id}
            style={styles.listItem}
            onPress={() => setSelectedBattery(battery)}
            activeOpacity={0.7}
          >
            <View style={styles.col1}>
              <View style={styles.productIconSmall}>
                <Ionicons name="battery-charging" size={20} color="#4F46E5" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{battery.name}</Text>
                <Text style={styles.productType}>{battery.type}</Text>
              </View>
            </View>

            <View style={styles.col2}>
              <Text style={styles.stockText}>{battery.stock}</Text>
              <Text style={styles.stockLabel}>units</Text>
            </View>

            <View style={styles.col3}>
              <View style={[styles.statusBadge, getStatusBadgeStyle(battery.status)]}>
                <View style={[styles.statusDot, getStatusDotColor(battery.status)]} />
                <Text style={[styles.statusText, getStatusTextStyle(battery.status)]}>
                  {getStatusLabel(battery.status)}
                </Text>
              </View>
            </View>

            <View style={styles.col4}>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={14} color="#6B7280" />
                <Text style={styles.locationText}>{battery.location}</Text>
              </View>
            </View>

            <View style={styles.col5}>
              <Text style={styles.contactText}>{battery.contact}</Text>
            </View>

            <View style={styles.col6}>
              <Text style={styles.priceText}>${battery.price}</Text>
            </View>

            <View style={styles.col7}>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => setSelectedBattery(battery)}
              >
                <Ionicons name="information-circle-outline" size={18} color="#4F46E5" />
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Detail Modal */}
      <Modal
        visible={selectedBattery !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBattery(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedBattery(null)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <View style={styles.modalIcon}>
                    <Ionicons name="battery-charging" size={28} color="#4F46E5" />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>{selectedBattery?.name}</Text>
                    <Text style={styles.modalSubtitle}>{selectedBattery?.type}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedBattery(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalDivider} />

              {/* Modal Body */}
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Product Information</Text>
                  <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Capacity</Text>
                      <Text style={styles.detailValue}>{selectedBattery?.capacity}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Voltage</Text>
                      <Text style={styles.detailValue}>{selectedBattery?.voltage}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Unit Price</Text>
                      <Text style={styles.detailValue}>${selectedBattery?.price}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Stock Level</Text>
                      <Text style={[styles.detailValue, getStockColor(selectedBattery?.status || '')]}>
                        {selectedBattery?.stock} units
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Storage Information</Text>
                  <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Location</Text>
                      <Text style={styles.detailValue}>Warehouse A - Section {selectedBattery?.id.slice(-1)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <View style={[styles.statusBadge, getStatusBadgeStyle(selectedBattery?.status || '')]}>
                        <View style={[styles.statusDot, getStatusDotColor(selectedBattery?.status || '')]} />
                        <Text style={[styles.statusText, getStatusTextStyle(selectedBattery?.status || '')]}>
                          {getStatusLabel(selectedBattery?.status || '')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Financial Summary</Text>
                  <View style={styles.financialCard}>
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Total Inventory Value</Text>
                      <Text style={styles.financialValue}>
                        ${((selectedBattery?.price || 0) * (selectedBattery?.stock || 0)).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Modal Footer - Actions */}
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.actionButtonPrimary}>
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.actionButtonPrimaryText}>Restock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButtonSecondary}>
                  <Ionicons name="create-outline" size={20} color="#4F46E5" />
                  <Text style={styles.actionButtonSecondaryText}>Edit Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButtonSecondary}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  <Text style={[styles.actionButtonSecondaryText, { color: '#EF4444' }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'available':
      return 'In Stock';
    case 'low_stock':
      return 'Low Stock';
    case 'out_of_stock':
      return 'Out of Stock';
    default:
      return status;
  }
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'available':
      return { backgroundColor: '#D1FAE5' };
    case 'low_stock':
      return { backgroundColor: '#FEF3C7' };
    case 'out_of_stock':
      return { backgroundColor: '#FEE2E2' };
    default:
      return { backgroundColor: '#F3F4F6' };
  }
}

function getStatusTextStyle(status: string) {
  switch (status) {
    case 'available':
      return { color: '#065F46' };
    case 'low_stock':
      return { color: '#92400E' };
    case 'out_of_stock':
      return { color: '#991B1B' };
    default:
      return { color: '#374151' };
  }
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
  filtersSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 16,
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  filterGroup: {
    flex: 1,
    minWidth: 200,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  listContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  listItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      },
    }),
  },
  col1: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 150,
  },
  col2: {
    flex: 0.8,
    alignItems: 'center',
    minWidth: 80,
  },
  col3: {
    flex: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  col4: {
    flex: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  col5: {
    flex: 1,
    alignItems: 'center',
    minWidth: 120,
  },
  col6: {
    flex: 0.8,
    alignItems: 'center',
    minWidth: 80,
  },
  col7: {
    flex: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  productIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  productType: {
    fontSize: 12,
    color: '#6B7280',
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  stockLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4F46E5',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '85%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    padding: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  modalBody: {
    maxHeight: 400,
    padding: 24,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  detailGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  financialCard: {
    backgroundColor: '#F5F3FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  financialValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4F46E5',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionButtonPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4F46E5',
  },
});
