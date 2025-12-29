import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { orders, batteries } from '@/utils/dummyData';

export default function SellerRevenue() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculate revenue metrics for seller
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const paidOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingPayments = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const totalOrders = orders.length;

  // Revenue breakdown by payment status
  const deliveredRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalPrice, 0);
  const processingRevenue = orders.filter(o => o.status === 'processing' || o.status === 'shipped').reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingRevenue = orders.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.totalPrice, 0);

  // Top selling products
  const productRevenue = batteries.map(battery => {
    const productOrders = orders.filter(o => o.batteryId === battery.id);
    const revenue = productOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const quantity = productOrders.reduce((sum, o) => sum + o.quantity, 0);
    return {
      ...battery,
      revenue,
      quantity,
      orderCount: productOrders.length,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Revenue Summary */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#10B981', '#34D399']}
          style={[styles.statCard, styles.statCardLarge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="trending-up" size={32} color="#fff" />
          <Text style={styles.statValueLarge}>${totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <LinearGradient
            colors={['#4F46E5', '#6366F1']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.statValue}>{paidOrders}</Text>
            <Text style={styles.statLabel}>Paid Orders</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#F59E0B', '#FBBF24']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="time" size={24} color="#fff" />
            <Text style={styles.statValue}>{pendingPayments}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="receipt" size={24} color="#fff" />
            <Text style={styles.statValue}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodTab, selectedPeriod === 'week' && styles.periodTabActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodTabText, selectedPeriod === 'week' && styles.periodTabTextActive]}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodTab, selectedPeriod === 'month' && styles.periodTabActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodTabText, selectedPeriod === 'month' && styles.periodTabTextActive]}>
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodTab, selectedPeriod === 'year' && styles.periodTabActive]}
          onPress={() => setSelectedPeriod('year')}
        >
          <Text style={[styles.periodTabText, selectedPeriod === 'year' && styles.periodTabTextActive]}>
            Year
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Status Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Status</Text>
        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <View style={styles.paymentInfo}>
              <View style={[styles.paymentDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.paymentLabel}>Received (Delivered)</Text>
            </View>
            <Text style={styles.paymentValue}>${deliveredRevenue.toLocaleString()}</Text>
          </View>
          <View style={styles.paymentRow}>
            <View style={styles.paymentInfo}>
              <View style={[styles.paymentDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.paymentLabel}>Processing/Shipped</Text>
            </View>
            <Text style={styles.paymentValue}>${processingRevenue.toLocaleString()}</Text>
          </View>
          <View style={styles.paymentRow}>
            <View style={styles.paymentInfo}>
              <View style={[styles.paymentDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.paymentLabel}>Awaiting Confirmation</Text>
            </View>
            <Text style={styles.paymentValue}>${pendingRevenue.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Top Selling Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling Products</Text>
        {productRevenue.map((product, index) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productRank}>
              <Text style={styles.productRankText}>#{index + 1}</Text>
            </View>
            <View style={styles.productIcon}>
              <Ionicons name="battery-charging" size={24} color="#4F46E5" />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productType}>{product.type}</Text>
              <View style={styles.productStats}>
                <Text style={styles.productStat}>{product.orderCount} orders</Text>
                <Text style={styles.productStat}>•</Text>
                <Text style={styles.productStat}>{product.quantity} units sold</Text>
              </View>
            </View>
            <View style={styles.productRevenue}>
              <Text style={styles.productRevenueValue}>${product.revenue.toLocaleString()}</Text>
              <Text style={styles.productRevenueLabel}>Revenue</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {orders.slice(0, 5).map((order) => (
          <View key={order.id} style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name={order.status === 'delivered' ? 'checkmark-circle' : 'time'}
                  size={24}
                  color={order.status === 'delivered' ? '#10B981' : '#F59E0B'}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{order.batteryName}</Text>
                <Text style={styles.transactionMeta}>
                  Order #{order.id} • {order.orderDate}
                </Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={styles.transactionValue}>
                  ${order.totalPrice.toFixed(2)}
                </Text>
                <View style={[styles.transactionStatus, getOrderStatusStyle(order.status)]}>
                  <Text style={[styles.transactionStatusText, getOrderStatusTextStyle(order.status)]}>
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
  statsContainer: {
    padding: 20,
    gap: 12,
  },
  statCardLarge: {
    paddingVertical: 24,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  statValueLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  periodTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  periodTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 12,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
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
    marginBottom: 4,
  },
  productType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  productStats: {
    flexDirection: 'row',
    gap: 8,
  },
  productStat: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  productRevenue: {
    alignItems: 'flex-end',
  },
  productRevenueValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 2,
  },
  productRevenueLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
    gap: 6,
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  transactionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  transactionStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
