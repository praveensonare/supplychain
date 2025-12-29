import React, { useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/DashboardHeader';
import { batteries, orders } from '@/utils/dummyData';

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  const totalOrders = orders.filter(o => o.seller === user.company).length;
  const activeOrders = orders.filter(
    o => o.seller === user.company && ['pending', 'processing', 'shipped'].includes(o.status)
  ).length;
  const totalRevenue = orders
    .filter(o => o.seller === user.company)
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const availableBatteries = batteries.filter(b => b.status === 'available');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#4F46E5', '#6366F1']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="cart" size={28} color="#fff" />
            <Text style={styles.statValue}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#10B981', '#34D399']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="time" size={28} color="#fff" />
            <Text style={styles.statValue}>{activeOrders}</Text>
            <Text style={styles.statLabel}>Active Orders</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#EC4899', '#F472B6']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="cash" size={28} color="#fff" />
            <Text style={styles.statValue}>${(totalRevenue / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </LinearGradient>
        </View>

        {/* Recent Orders */}
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
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle}>{order.batteryName}</Text>
                  <Text style={styles.orderId}>#{order.id}</Text>
                </View>
                <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                  <Text style={[styles.statusText, getStatusTextStyle(order.status)]}>
                    {order.status}
                  </Text>
                </View>
              </View>
              <View style={styles.orderDetails}>
                <View style={styles.orderDetail}>
                  <Ionicons name="cube-outline" size={16} color="#6B7280" />
                  <Text style={styles.orderDetailText}>Qty: {order.quantity}</Text>
                </View>
                <View style={styles.orderDetail}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.orderDetailText}>{order.orderDate}</Text>
                </View>
                <View style={styles.orderDetail}>
                  <Ionicons name="cash-outline" size={16} color="#6B7280" />
                  <Text style={styles.orderDetailText}>${order.totalPrice.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Available Batteries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Batteries</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {availableBatteries.slice(0, 4).map(battery => (
            <View key={battery.id} style={styles.batteryCard}>
              <View style={styles.batteryIcon}>
                <Ionicons name="battery-charging" size={24} color="#4F46E5" />
              </View>
              <View style={styles.batteryInfo}>
                <Text style={styles.batteryName}>{battery.name}</Text>
                <Text style={styles.batteryType}>{battery.type}</Text>
                <View style={styles.batterySpecs}>
                  <View style={styles.specBadge}>
                    <Text style={styles.specText}>{battery.capacity}</Text>
                  </View>
                  <View style={styles.specBadge}>
                    <Text style={styles.specText}>{battery.voltage}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.batteryPricing}>
                <Text style={styles.batteryPrice}>${battery.price}</Text>
                <Text style={styles.batteryStock}>{battery.stock} in stock</Text>
                <TouchableOpacity style={styles.orderButton}>
                  <Text style={styles.orderButtonText}>Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
    </ScrollView>
  );
}

function getStatusStyle(status: string) {
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

function getStatusTextStyle(status: string) {
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
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
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
  section: {
    paddingHorizontal: 20,
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
    color: '#4F46E5',
    fontWeight: '500',
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  orderId: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  batteryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  batteryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  batteryInfo: {
    flex: 1,
  },
  batteryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  batteryType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  batterySpecs: {
    flexDirection: 'row',
    gap: 6,
  },
  specBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '500',
  },
  batteryPricing: {
    alignItems: 'flex-end',
  },
  batteryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  batteryStock: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 8,
  },
  orderButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
