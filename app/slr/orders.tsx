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

type OrderTab = 'source' | 'received';

export default function SellerOrders() {
  const [selectedTab, setSelectedTab] = useState<OrderTab>('source');

  // Source Orders - Orders that have been accepted and are in progress
  const sourceOrders = orders.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status));

  // Received Orders - Orders that need action (pending)
  const receivedOrders = orders.filter(o => o.status === 'pending');

  const currentOrders = selectedTab === 'source' ? sourceOrders : receivedOrders;

  // Summary stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="receipt"
          value={totalOrders}
          label="Total Orders"
          colors={['#4F46E5', '#6366F1']}
        />
        <StatCard
          icon="time"
          value={activeOrders}
          label="Active"
          colors={['#F59E0B', '#FBBF24']}
        />
        <StatCard
          icon="checkmark-circle"
          value={completedOrders}
          label="Completed"
          colors={['#10B981', '#34D399']}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'source' && styles.tabActive]}
          onPress={() => setSelectedTab('source')}
        >
          <Ionicons
            name="cube"
            size={20}
            color={selectedTab === 'source' ? '#4F46E5' : '#6B7280'}
          />
          <Text style={[styles.tabText, selectedTab === 'source' && styles.tabTextActive]}>
            Source Orders
          </Text>
          <View style={[styles.tabBadge, selectedTab === 'source' && styles.tabBadgeActive]}>
            <Text style={[styles.tabBadgeText, selectedTab === 'source' && styles.tabBadgeTextActive]}>
              {sourceOrders.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'received' && styles.tabActive]}
          onPress={() => setSelectedTab('received')}
        >
          <Ionicons
            name="mail"
            size={20}
            color={selectedTab === 'received' ? '#4F46E5' : '#6B7280'}
          />
          <Text style={[styles.tabText, selectedTab === 'received' && styles.tabTextActive]}>
            Received Orders
          </Text>
          <View style={[styles.tabBadge, selectedTab === 'received' && styles.tabBadgeActive]}>
            <Text style={[styles.tabBadgeText, selectedTab === 'received' && styles.tabBadgeTextActive]}>
              {receivedOrders.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tab Info */}
      <View style={styles.tabInfoContainer}>
        {selectedTab === 'source' && (
          <View style={styles.tabInfo}>
            <Ionicons name="information-circle-outline" size={20} color="#4F46E5" />
            <Text style={styles.tabInfoText}>
              These are orders that have been accepted and are currently being processed or shipped.
            </Text>
          </View>
        )}
        {selectedTab === 'received' && (
          <View style={styles.tabInfo}>
            <Ionicons name="information-circle-outline" size={20} color="#F59E0B" />
            <Text style={styles.tabInfoText}>
              These are new orders from downstream that require your action: Accept, Reject, or Request More Info.
            </Text>
          </View>
        )}
      </View>

      {/* Orders List */}
      <View style={styles.ordersList}>
        <Text style={styles.sectionTitle}>
          {selectedTab === 'source' ? 'Source Orders' : 'Received Orders'}
        </Text>

        {currentOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No orders found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedTab === 'source'
                ? 'Accepted orders will appear here'
                : 'New orders from downstream will appear here'}
            </Text>
          </View>
        ) : (
          currentOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderIconContainer}>
                  <Ionicons name="receipt" size={24} color="#4F46E5" />
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle}>{order.batteryName}</Text>
                  <Text style={styles.orderMeta}>Order #{order.id} • {order.orderDate}</Text>
                  {order.manufacturer && (
                    <Text style={styles.orderManufacturer}>
                      Manufacturer: {order.manufacturer}
                    </Text>
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

                {selectedTab === 'received' && order.status === 'pending' && (
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

                {selectedTab === 'source' && (
                  <View style={styles.orderTrackingActions}>
                    <TouchableOpacity style={styles.trackingButton}>
                      <Ionicons name="location-outline" size={18} color="#4F46E5" />
                      <Text style={styles.trackingButtonText}>Track Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewDetailsButton}>
                      <Text style={styles.viewDetailsButtonText}>View Details</Text>
                      <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: '#4F46E5',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabBadgeTextActive: {
    color: '#fff',
  },
  tabInfoContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabInfo: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  tabInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
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
  orderManufacturer: {
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
  orderTrackingActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  trackingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  trackingButtonText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewDetailsButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
});
