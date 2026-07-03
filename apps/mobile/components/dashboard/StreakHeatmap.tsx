import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../lib/themeStore';

interface StreakHeatmapProps {
  activityHistory: number[]; // Array of 84 numbers (0-4) representing the last 12 weeks
}

export function StreakHeatmap({ activityHistory }: StreakHeatmapProps) {
  const C = useAppTheme();

  // Helper to get color based on intensity (0-4)
  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return `${C.brand}15`; // Lightest (15% opacity)
      case 1: return `${C.brand}40`;
      case 2: return `${C.brand}70`;
      case 3: return `${C.brand}A0`;
      case 4: return C.brand;        // Full intensity
      default: return `${C.brand}15`;
    }
  };

  // We want to render this in columns of 7 (weeks), and there are 12 columns.
  // The activityHistory array is chronologically sorted from oldest to newest (index 83 is today).
  // So week 0 (col 0) is days 0-6. Week 11 (col 11) is days 77-83.
  const weeks = [];
  for (let i = 0; i < 12; i++) {
    const column = activityHistory.slice(i * 7, (i + 1) * 7);
    weeks.push(column);
  }

  return (
    <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <Text style={[styles.title, { color: C.foreground }]}>Last 3 Months</Text>
      
      <View style={styles.heatmapContainer}>
        {/* Y-Axis Labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.axisText, { color: C.textTertiary, marginTop: 4 }]}>M</Text>
          <Text style={[styles.axisText, { color: C.textTertiary, marginTop: 18 }]}>W</Text>
          <Text style={[styles.axisText, { color: C.textTertiary, marginTop: 18 }]}>F</Text>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {weeks.map((week, colIdx) => (
            <View key={`col-${colIdx}`} style={styles.column}>
              {week.map((intensity, rowIdx) => (
                <View
                  key={`cell-${colIdx}-${rowIdx}`}
                  style={[
                    styles.cell,
                    { backgroundColor: getColor(intensity) }
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={[styles.legendText, { color: C.textTertiary }]}>Less</Text>
        <View style={styles.legendRow}>
          {[0, 1, 2, 3, 4].map(level => (
            <View key={`legend-${level}`} style={[styles.cell, { backgroundColor: getColor(level) }]} />
          ))}
        </View>
        <Text style={[styles.legendText, { color: C.textTertiary }]}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  heatmapContainer: {
    flexDirection: 'row',
  },
  yAxis: {
    marginRight: 10,
    justifyContent: 'flex-start',
  },
  axisText: {
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    gap: 4,
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
