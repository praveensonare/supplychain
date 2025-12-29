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
import { StatCard } from '@/components/StatCard';
import { orders } from '@/utils/dummyData';

export default function ManufacturerOrders() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const receivedOrders = orders.length;
  const acceptedOrders = orders.filter(o => o.status === 'processing' || o.status === 'shipped' || o.status === 'delivered').length;
  const inTransitOrders = orders.filter(o => o.status === 'shipped').length;
  const needsInfoOrders = orders.filter(o => o.status === 'pending').length;

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(o => {
        if (selectedStatus === 'received') return true;
        if (selectedStatus === 'accepted') return ['processing', 'shipped', 'delivered'].includes(o.status);
        if (selectedStatus === 'in_transit') return o.status === 'shipped';
        if (selectedStatus === 'more_info') return o.status === 'pending';
        return true;
      });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="mail"
          value={receivedOrders}
          label="Received"
          colors={['#4F46E5', '#6366F1']}
        />
        <StatCard
          icon="checkmark-circle"
          value={acceptedOrders}
          label="Accepted"
          colors={['#10B981', '#34D399']}
        />
        <StatCard
          icon="car"
          value={inTransitOrders}
          label="In Transit"
          colors={['#8B5CF6', '#A78BFA']}
        />
        <StatCard
          icon="information-circle"
          value={needsInfoOrders}
          label="More Info"
          colors={['#F59E0B', '#FBBF24']}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterTab, selectedStatus === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedStatus('all')}
          >
            <Text style={[styles.filterTabText, selectedStatus === 'all' && styles.filterTabTextActive]}>
              All Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedStatus === 'received' && styles.filterTabActive]}
            onPress={() => setSelectedStatus('received')}
          >
            <Text style={[styles.filterTabText, selectedStatus === 'received' && styles.filterTabTextActive]}>
              Received
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedStatus === 'accepted' && styles.filterTabActive]}
            onPress={() => setSelectedStatus('accepted')}
          >
            <Text style={[styles.filterTabText, selectedStatus === 'accepted' && styles.filterTabTextActive]}>
              Accepted
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedStatus === 'in_transit' && styles.filterTabActive]}
            onPress={() => setSelectedStatus('in_transit')}
          >
            <Text style={[styles.filterTabText, selectedStatus === 'in_transit' && styles.filterTabTextActive]}>
              In Transit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedStatus === 'more_info' && styles.filterTabActive]}
            onPress={() => setSelectedStatus('more_info')}
          >
            <Text style={[styles.filterTabText, selectedStatus === 'more_info' && styles.filterTabTextActive]}>
              More Info
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Orders List */}
      <View style={styles.ordersList}>
        <Text style={styles.sectionTitle}>
          {selectedStatus === 'all' ? 'All Orders' : `${selectedStatus.replace('_', ' ').toUpperCase()} Orders`}
        </Text>
        {filteredOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderIconContainer}>
                <Ionicons name="receipt" size={24} color="#4F46E5" />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderTitle}>{order.batteryName}</Text>
                <Text style={styles.orderMeta}>Order #{order.id} • {order.orderDate}</Text>
                {order.seller && (
                  <Text style={styles.orderSeller}>Seller: {order.seller}</Text>
                )}
              </View>
              <View style={[styles.statusBadge, getOrderStatusStyle(order.status)]}>
                <Text style={[styles.statusText, getOrderStatusTextStyle(order.status)]}>
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.orderDetailRow}>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailLabel}>Quantity</Text>
                  <Text style={styles.orderDetailValue}>{order.quantity} units</Text>
                </View>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailLabel}>Total Amount</Text>
                  <Text style={styles.orderDetailValue}>${order.totalPrice.toFixed(2)}</Text>
                </View>
              </View>

              {order.status === 'pending' && (
                <View style={styles.orderActions}>
                  <TouchableOpacity style={styles.actionButtonAccept}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                    <Text style={styles.actionButtonAcceptText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButtonReject}>
                    <Ionicons name="close" size={18} color="#EF4444" />
                    <Text style={styles.actionButtonRejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButtonInfo}>
                    <Ionicons name="information-circle-outline" size={18} color="#F59E0B" />
                    <Text style={styles.actionButtonInfoText}>More Info</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  ordersList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  orderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  orderMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  orderSeller: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderDetails: {
    gap: 12,
  },
  orderDetailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  orderDetailItem: {
    flex: 1,
  },
  orderDetailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  orderDetailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButtonAccept: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonAcceptText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  actionButtonReject: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonRejectText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  actionButtonInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonInfoText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
});
