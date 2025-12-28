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
import { shipments, orders } from '@/utils/dummyData';

export default function LogisticsDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'logistics') {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  const totalShipments = shipments.length;
  const inTransit = shipments.filter(s => s.status === 'in_transit').length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const pending = shipments.filter(s => s.status === 'picked_up').length;

  return (
    <View style={styles.container}>
      <DashboardHeader
        title="Logistics Dashboard"
        subtitle={`Welcome, ${user.name}`}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#F59E0B', '#FBBF24']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="cube" size={28} color="#fff" />
            <Text style={styles.statValue}>{totalShipments}</Text>
            <Text style={styles.statLabel}>Total Shipments</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#3B82F6', '#60A5FA']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="car" size={28} color="#fff" />
            <Text style={styles.statValue}>{inTransit}</Text>
            <Text style={styles.statLabel}>In Transit</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#10B981', '#34D399']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
            <Text style={styles.statValue}>{delivered}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </LinearGradient>
        </View>

        {/* Active Shipments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Shipments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {shipments.map(shipment => {
            const order = orders.find(o => o.id === shipment.orderId);
            return (
              <View key={shipment.id} style={styles.shipmentCard}>
                <View style={styles.shipmentHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={getShipmentIcon(shipment.status)}
                      size={24}
                      color="#4F46E5"
                    />
                  </View>
                  <View style={styles.shipmentInfo}>
                    <Text style={styles.shipmentTitle}>
                      {order?.batteryName || 'Unknown Item'}
                    </Text>
                    <Text style={styles.trackingNumber}>
                      Tracking: {shipment.trackingNumber}
                    </Text>
                  </View>
                  <View style={[styles.shipmentStatusBadge, getShipmentStatusStyle(shipment.status)]}>
                    <Text style={[styles.shipmentStatusText, getShipmentStatusTextStyle(shipment.status)]}>
                      {formatStatus(shipment.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.shipmentRoute}>
                  <View style={styles.routePoint}>
                    <View style={styles.routeIconContainer}>
                      <Ionicons name="location" size={16} color="#6B7280" />
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeLabel}>Origin</Text>
                      <Text style={styles.routeAddress}>{shipment.origin}</Text>
                    </View>
                  </View>

                  <View style={styles.routeDivider}>
                    <View style={styles.routeLine} />
                    <Ionicons name="arrow-down" size={16} color="#D1D5DB" />
                  </View>

                  {shipment.currentLocation && shipment.status !== 'delivered' && (
                    <>
                      <View style={styles.routePoint}>
                        <View style={[styles.routeIconContainer, styles.currentLocation]}>
                          <Ionicons name="navigate" size={16} color="#4F46E5" />
                        </View>
                        <View style={styles.routeInfo}>
                          <Text style={styles.routeLabel}>Current Location</Text>
                          <Text style={styles.routeAddress}>{shipment.currentLocation}</Text>
                        </View>
                      </View>
                      <View style={styles.routeDivider}>
                        <View style={styles.routeLine} />
                        <Ionicons name="arrow-down" size={16} color="#D1D5DB" />
                      </View>
                    </>
                  )}

                  <View style={styles.routePoint}>
                    <View style={styles.routeIconContainer}>
                      <Ionicons name="flag" size={16} color="#6B7280" />
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeLabel}>Destination</Text>
                      <Text style={styles.routeAddress}>{shipment.destination}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.shipmentFooter}>
                  <View style={styles.etaContainer}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.etaText}>
                      ETA: {shipment.estimatedDelivery}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.trackButton}>
                    <Text style={styles.trackButtonText}>Track</Text>
                    <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Fleet Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fleet Overview</Text>
          <View style={styles.fleetContainer}>
            <View style={styles.fleetCard}>
              <Ionicons name="car-sport" size={32} color="#4F46E5" />
              <Text style={styles.fleetValue}>12</Text>
              <Text style={styles.fleetLabel}>Vehicles Active</Text>
            </View>
            <View style={styles.fleetCard}>
              <Ionicons name="people" size={32} color="#10B981" />
              <Text style={styles.fleetValue}>24</Text>
              <Text style={styles.fleetLabel}>Drivers Online</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function getShipmentIcon(status: string) {
  switch (status) {
    case 'delivered':
      return 'checkmark-circle';
    case 'in_transit':
      return 'car';
    case 'out_for_delivery':
      return 'bicycle';
    case 'picked_up':
      return 'cube';
    default:
      return 'cube-outline';
  }
}

function getShipmentStatusStyle(status: string) {
  switch (status) {
    case 'delivered':
      return { backgroundColor: '#D1FAE5' };
    case 'in_transit':
      return { backgroundColor: '#DBEAFE' };
    case 'out_for_delivery':
      return { backgroundColor: '#FEF3C7' };
    case 'picked_up':
      return { backgroundColor: '#E0E7FF' };
    default:
      return { backgroundColor: '#F3F4F6' };
  }
}

function getShipmentStatusTextStyle(status: string) {
  switch (status) {
    case 'delivered':
      return { color: '#065F46' };
    case 'in_transit':
      return { color: '#1E40AF' };
    case 'out_for_delivery':
      return { color: '#92400E' };
    case 'picked_up':
      return { color: '#4338CA' };
    default:
      return { color: '#374151' };
  }
}

function formatStatus(status: string) {
  return status.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
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
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  shipmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  trackingNumber: {
    fontSize: 12,
    color: '#6B7280',
  },
  shipmentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  shipmentStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  shipmentRoute: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentLocation: {
    backgroundColor: '#EEF2FF',
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: '#1F2937',
  },
  routeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginVertical: 4,
  },
  routeLine: {
    width: 1,
    height: 20,
    backgroundColor: '#D1D5DB',
    marginRight: 8,
  },
  shipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  etaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  trackButtonText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  fleetContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  fleetCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fleetValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
  },
  fleetLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});
