import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
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

export function PieChartCard({ title, data, total, totalLabel = 'Total' }: PieChartCardProps) {
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 60, 220);

  const handleSlicePress = (index: number) => {
    const isAlreadySelected = selectedSlice === index;
    setSelectedSlice(isAlreadySelected ? null : index);

    // Zoom animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.card}>
      {/* Header: Title (left) and Total (right) on same line */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {total !== undefined && (
          <View style={styles.totalInline}>
            <Text style={styles.totalLabelInline}>{totalLabel}: </Text>
            <Text style={styles.totalValueInline}>{total.toLocaleString()}</Text>
          </View>
        )}
      </View>

      {/* Pie Chart - Centered and Interactive */}
      <Animated.View style={[styles.chartWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <PieChart
          data={data}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="20"
          absolute
          hasLegend={false}
        />
      </Animated.View>

      {/* Compact Legend - Color mapping only */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.legendItem,
              selectedSlice === index && styles.legendItemActive
            ]}
            onPress={() => handleSlicePress(index)}
            activeOpacity={0.7}
          >
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Slice Details - Shows on interaction */}
      {selectedSlice !== null && (
        <View style={[styles.detailsBadge, { borderLeftColor: data[selectedSlice].color }]}>
          <View style={styles.detailsContent}>
            <Text style={styles.detailsName}>{data[selectedSlice].name}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsValue}>{data[selectedSlice].value.toLocaleString()} units</Text>
              <Text style={styles.detailsPercent}>
                {((data[selectedSlice].value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
              </Text>
            </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    minWidth: 150,
  },
  totalInline: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabelInline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  totalValueInline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4F46E5',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    overflow: 'visible',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 100,
  },
  legendItemActive: {
    backgroundColor: '#F5F3FF',
    borderColor: '#E9D5FF',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  detailsBadge: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  detailsContent: {
    gap: 8,
  },
  detailsName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  detailsPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
