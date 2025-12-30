import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/StatCard';
import { PieChartCard } from '@/components/PieChartCard';
import { batteries, orders } from '@/utils/dummyData';

export default function ManufacturerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && (!isAuthenticated || user?.role !== 'manufacturer')) {
      setTimeout(() => {
        router.replace('/');
      }, 0);
    }
  }, [isMounted, isAuthenticated, user, router]);

  if (!user) return null;

  const totalProduction = batteries.reduce((sum, b) => sum + b.stock, 0);
  const activeProducts = batteries.filter(b => b.status !== 'out_of_stock').length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const totalInventoryValue = batteries.reduce((sum, b) => sum + (b.price * b.stock), 0);

  // Pie Chart 1: Inventory by Status
  const inventoryStatusData = [
    {
      name: 'Available',
      value: Math.floor(totalProduction * 0.6),
      color: '#10B981',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Maintenance',
      value: Math.floor(totalProduction * 0.15),
      color: '#F59E0B',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Booked',
      value: Math.floor(totalProduction * 0.2),
      color: '#3B82F6',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Expired',
      value: Math.floor(totalProduction * 0.05),
      color: '#EF4444',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  // Pie Chart 2: Inventory by Battery Type
  const batteryTypeData = [
    {
      name: 'Solid State',
      value: Math.floor(totalProduction * 0.65),
      color: '#8B5CF6',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Flow Battery',
      value: Math.floor(totalProduction * 0.35),
      color: '#EC4899',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  // Pie Chart 3: Inventory by Location (India)
  const locationData = [
    {
      name: 'Mumbai',
      value: Math.floor(totalProduction * 0.35),
      color: '#4F46E5',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Bangalore',
      value: Math.floor(totalProduction * 0.25),
      color: '#06B6D4',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Delhi',
      value: Math.floor(totalProduction * 0.2),
      color: '#F59E0B',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Chennai',
      value: Math.floor(totalProduction * 0.12),
      color: '#10B981',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Pune',
      value: Math.floor(totalProduction * 0.08),
      color: '#EF4444',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <StatCard
            icon="cube"
            value={totalProduction}
            label="Total Units"
            colors={['#8B5CF6', '#A78BFA']}
          />
          <StatCard
            icon="layers"
            value={activeProducts}
            label="Active Products"
            colors={['#EC4899', '#F472B6']}
          />
          <StatCard
            icon="hourglass"
            value={pendingOrders}
            label="Pending Orders"
            colors={['#F59E0B', '#FBBF24']}
          />
          <StatCard
            icon="trending-up"
            value={`$${(totalInventoryValue / 1000).toFixed(0)}K`}
            label="Inventory Value"
            colors={['#10B981', '#34D399']}
          />
        </View>

        {/* Inventory Analytics - Pie Charts */}
        <View style={styles.chartsSection}>
          <Text style={styles.chartsSectionTitle}>Inventory Analytics</Text>

          <View style={styles.chartsGrid}>
            {/* Pie Chart 1: Inventory Status */}
            <View style={styles.chartCard}>
              <PieChartCard
                title="Inventory by Status"
                data={inventoryStatusData}
                total={totalProduction}
                totalLabel="Total Inventory"
              />
            </View>

            {/* Pie Chart 2: Battery Types */}
            <View style={styles.chartCard}>
              <PieChartCard
                title="Inventory by Battery Type"
                data={batteryTypeData}
                total={totalProduction}
                totalLabel="Total Inventory"
              />
            </View>

            {/* Pie Chart 3: Location Distribution */}
            <View style={styles.chartCard}>
              <PieChartCard
                title="Inventory by Location"
                data={locationData}
                total={totalProduction}
                totalLabel="Total Inventory"
              />
            </View>
          </View>
        </View>

        {/* Production Inventory */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Production Inventory</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {batteries.map(battery => (
            <View key={battery.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productIcon}>
                  <Ionicons name="battery-charging" size={28} color="#8B5CF6" />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{battery.name}</Text>
                  <Text style={styles.productType}>{battery.type}</Text>
                  <View style={styles.productSpecs}>
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

              <View style={styles.productDetails}>
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
                    <Text style={styles.actionButtonText}>Produce</Text>
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

        {/* Recent Production Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {orders.slice(0, 3).map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderIconContainer}>
                  <Ionicons name="receipt" size={20} color="#8B5CF6" />
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle}>{order.batteryName}</Text>
                  <Text style={styles.orderMeta}>
                    Order #{order.id} • {order.orderDate}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailLabel}>Quantity</Text>
                  <Text style={styles.orderDetailValue}>{order.quantity} units</Text>
                </View>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailLabel}>Total</Text>
                  <Text style={styles.orderDetailValue}>${order.totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailLabel}>Status</Text>
                  <View style={[styles.orderStatus, getOrderStatusStyle(order.status)]}>
                    <Text style={[styles.orderStatusText, getOrderStatusTextStyle(order.status)]}>
                      {order.status}
                    </Text>
                  </View>
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

function getOrderStatusStyle(status: string) {
  switch (status) {
    case 'delivered':
      return { backgroundColor: '#D1FAE5' };
    case 'shipped':
      return { backgroundColor: '#DBEAFE' };
    case 'processing':
      return { backgroundColor: '#FEF3C7' };
    case 'pending':
      return { backgroundColor: '#FEE2E2' };
    default:
      return { backgroundColor: '#F3F4F6' };
  }
}

function getOrderStatusTextStyle(status: string) {
  switch (status) {
    case 'delivered':
      return { color: '#065F46' };
    case 'shipped':
      return { color: '#1E40AF' };
    case 'processing':
      return { color: '#92400E' };
    case 'pending':
      return { color: '#991B1B' };
    default:
      return { color: '#374151' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  chartsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  chartsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    ...Platform.select({
      web: {
        justifyContent: 'space-between',
      },
    }),
  },
  chartCard: {
    flex: 1,
    minWidth: 300,
    ...Platform.select({
      web: {
        maxWidth: '48%',
      },
    }),
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productType: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  productSpecs: {
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
  productDetails: {
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
    color: '#8B5CF6',
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
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  orderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  orderMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  orderDetailItem: {
    flex: 1,
  },
  orderDetailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  orderDetailValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
