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
  const chartWidth = Math.min(screenWidth - 40, 320);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.contentContainer}>
        {/* Pie Chart - Center */}
        <View style={styles.chartContainer}>
          <PieChart
            data={data}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={false}
          />
        </View>

        {/* Total Inventory Display - Inline */}
        {total !== undefined && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{totalLabel}</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}</Text>
          </View>
        )}
      </View>

      {/* Legend with hover effect */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.legendItem,
              selectedSlice === index && styles.legendItemSelected
            ]}
            onPress={() => setSelectedSlice(selectedSlice === index ? null : index)}
            activeOpacity={0.7}
          >
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendName}>{item.name}</Text>
              <Text style={styles.legendValue}>{item.value} units</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected item details */}
      {selectedSlice !== null && (
        <View style={styles.detailsCard}>
          <View style={[styles.detailsIndicator, { backgroundColor: data[selectedSlice].color }]} />
          <View style={styles.detailsContent}>
            <Text style={styles.detailsName}>{data[selectedSlice].name}</Text>
            <Text style={styles.detailsValue}>{data[selectedSlice].value} units</Text>
            <Text style={styles.detailsPercentage}>
              {((data[selectedSlice].value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
            </Text>
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
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 16,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    overflow: 'visible',
  },
  totalContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    minWidth: 140,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4F46E5',
  },
  legendContainer: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  legendItemSelected: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  detailsCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailsIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  detailsContent: {
    flex: 1,
  },
  detailsName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 2,
  },
  detailsPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
});
