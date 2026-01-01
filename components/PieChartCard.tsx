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
  const chartWidth = Math.min(screenWidth - 40, 180);

  return (
    <View style={styles.card}>
      {/* Title and Total Inline */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        {total !== undefined && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{totalLabel}</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}</Text>
          </View>
        )}
      </View>

      {/* Pie Chart - Centered */}
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          width={chartWidth}
          height={160}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
          hasLegend={false}
        />
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 400,
    display: 'flex' as any,
    flexDirection: 'column',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    minWidth: 120,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    overflow: 'visible',
  },
  totalContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  legendContainer: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  legendItemSelected: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  detailsCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailsIndicator: {
    width: 3,
    height: 30,
    borderRadius: 2,
  },
  detailsContent: {
    flex: 1,
  },
  detailsName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 3,
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 2,
  },
  detailsPercentage: {
    fontSize: 11,
    color: '#6B7280',
  },
});
