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
}

export function PieChartCard({ title, data }: PieChartCardProps) {
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 80, 280);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          width={chartWidth}
          height={200}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
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
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
