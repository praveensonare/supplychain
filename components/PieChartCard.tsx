import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Platform } from 'react-native';
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
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 40, 240);
  const chartRadius = 80; // Approximate radius of the pie chart

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

  // Calculate cumulative percentages for slice positioning
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;
  const sliceAngles = data.map((item) => {
    const percent = item.value / totalValue;
    const startAngle = cumulativePercent * 360;
    const endAngle = (cumulativePercent + percent) * 360;
    cumulativePercent += percent;
    return { startAngle, endAngle, percent };
  });

  // Create hoverable slices
  const renderHoverableSlices = () => {
    return sliceAngles.map((slice, index) => {
      const midAngle = ((slice.startAngle + slice.endAngle) / 2) * (Math.PI / 180);
      const distance = chartRadius * 0.6; // Position at 60% of radius

      // Calculate position for the hoverable area
      const x = Math.cos(midAngle - Math.PI / 2) * distance;
      const y = Math.sin(midAngle - Math.PI / 2) * distance;

      const hoverProps = Platform.OS === 'web' ? {
        onMouseEnter: () => setHoveredSlice(index),
        onMouseLeave: () => setHoveredSlice(null),
      } : {};

      return (
        <View
          key={index}
          style={[
            styles.hoverableSlice,
            {
              left: chartWidth / 2 + x - 20,
              top: 100 + y - 20,
            },
          ]}
          {...(hoverProps as any)}
        >
          <TouchableOpacity
            style={styles.sliceButton}
            onPress={() => handleSlicePress(index)}
            activeOpacity={0.6}
          />
        </View>
      );
    });
  };

  const displaySlice = hoveredSlice !== null ? hoveredSlice : selectedSlice;

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

      {/* Pie Chart with Hover Detection */}
      <View style={styles.chartContainer}>
        <Animated.View style={[styles.chartWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <PieChart
            data={data}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="30"
            absolute
            hasLegend={false}
          />
        </Animated.View>

        {/* Hoverable overlay slices */}
        {Platform.OS === 'web' && (
          <View style={styles.hoverOverlay}>
            {renderHoverableSlices()}
          </View>
        )}
      </View>

      {/* Hover Tooltip - Shows on mouse hover */}
      {displaySlice !== null && (
        <View style={[styles.tooltip, { backgroundColor: data[displaySlice].color + '15', borderLeftColor: data[displaySlice].color }]}>
          <View style={styles.tooltipContent}>
            <Text style={styles.tooltipTitle}>{data[displaySlice].name}</Text>
            <View style={styles.tooltipRow}>
              <Text style={styles.tooltipValue}>{data[displaySlice].value.toLocaleString()} units</Text>
              <Text style={styles.tooltipPercent}>
                {(sliceAngles[displaySlice].percent * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Compact Legend - Color mapping only */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => {
          const legendHoverProps = Platform.OS === 'web' ? {
            onMouseEnter: () => setHoveredSlice(index),
            onMouseLeave: () => setHoveredSlice(null),
          } : {};

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.legendItem,
                (selectedSlice === index || hoveredSlice === index) && styles.legendItemActive
              ]}
              onPress={() => handleSlicePress(index)}
              {...(legendHoverProps as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 12,
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
  chartContainer: {
    position: 'relative' as any,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    zIndex: 5,
    position: 'relative' as any,
  },
  hoverOverlay: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'box-none' as any,
  },
  hoverableSlice: {
    position: 'absolute' as any,
    width: 40,
    height: 40,
    zIndex: 15,
  },
  sliceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tooltip: {
    marginTop: 12,
    marginBottom: 8,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tooltipContent: {
    gap: 6,
  },
  tooltipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  tooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tooltipValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  tooltipPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
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
});
