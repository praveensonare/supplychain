import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface PieChartData {
  name: string;
  value: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

interface PieChartCardProps {
  title: string;
  data: PieChartData[];
  total?: number;
  totalLabel?: string;
}

export function PieChartCard({ title, data, total, totalLabel = 'Total Inventory' }: PieChartCardProps) {
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 60, 260);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Total Display - Large and Prominent */}
      {total !== undefined && (
        <View style={styles.totalSection}>
          <Text style={styles.totalValue}>{total.toLocaleString()}</Text>
          <Text style={styles.totalLabel}>{totalLabel}</Text>
        </View>
      )}

      {/* Pie Chart */}
      <View style={styles.chartWrapper}>
        <PieChart
          data={data}
          width={chartWidth}
          height={200}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={false}
        />
      </View>

      {/* Compact Legend */}
      <View style={styles.legendGrid}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.legendItem,
              selectedSlice === index && styles.legendItemActive
            ]}
            onPress={() => setSelectedSlice(selectedSlice === index ? null : index)}
            activeOpacity={0.7}
          >
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.legendPercent}>
              {((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0)}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Slice Details */}
      {selectedSlice !== null && (
        <View style={[styles.selectionBadge, { borderColor: data[selectedSlice].color }]}>
          <View style={[styles.selectionIndicator, { backgroundColor: data[selectedSlice].color }]} />
          <View style={styles.selectionContent}>
            <Text style={styles.selectionName}>{data[selectedSlice].name}</Text>
            <Text style={styles.selectionValue}>{data[selectedSlice].value.toLocaleString()} units</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  totalSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingVertical: 12,
  },
  legendGrid: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  legendItemActive: {
    backgroundColor: '#F5F3FF',
    borderColor: '#E9D5FF',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  legendPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  selectionBadge: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectionIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  selectionContent: {
    flex: 1,
  },
  selectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
