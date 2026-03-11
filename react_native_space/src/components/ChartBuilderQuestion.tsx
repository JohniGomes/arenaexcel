import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
} from 'react-native-chart-kit';

interface Props {
  spreadsheetContext: { cells?: Record<string, any> };
  onSubmit: (value: string) => void;
  answered: boolean;
}

type ChartType = 'column' | 'line' | 'pie' | 'bar';

const CHART_BUTTONS: { type: ChartType; icon: string; label: string }[] = [
  { type: 'column', icon: '📊', label: 'Colunas' },
  { type: 'line',   icon: '📈', label: 'Linhas' },
  { type: 'pie',    icon: '🥧', label: 'Pizza' },
  { type: 'bar',    icon: '📉', label: 'Barras' },
];

function parseCells(cells: Record<string, any>) {
  // Find all row numbers
  const rowNums = new Set<number>();
  Object.keys(cells).forEach(k => {
    const m = k.match(/^[A-Z]+(\d+)$/);
    if (m) rowNums.add(Number(m[1]));
  });
  const rows = Array.from(rowNums).sort((a, b) => a - b);
  const header = rows[0];
  const dataRows = rows.slice(1);

  const labelKey = `A${header}`;
  const valueKey = `B${header}`;
  const labelHeader: string = cells[labelKey] ?? 'Label';
  const valueHeader: string = cells[valueKey] ?? 'Valor';

  const labels: string[] = dataRows.map(r => String(cells[`A${r}`] ?? ''));
  const values: number[] = dataRows.map(r => Number(cells[`B${r}`] ?? 0));

  return { labelHeader, valueHeader, labels, values };
}

const CHART_CONFIG = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33, 115, 70, ${opacity})`,
  labelColor: () => '#4A4A6A',
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#217346' },
  style: { borderRadius: 8 },
};

export default function ChartBuilderQuestion({ spreadsheetContext, onSubmit, answered }: Props) {
  const [selected, setSelected] = useState<ChartType | null>(null);
  const { width } = useWindowDimensions();
  const chartWidth = width - 40; // 20px padding each side

  const cells = spreadsheetContext?.cells ?? {};
  const { labelHeader, valueHeader, labels, values } = parseCells(cells);

  const allRows = Object.keys(cells)
    .map(k => k.match(/^[A-Z]+(\d+)$/)?.[1])
    .filter(Boolean)
    .map(Number);
  const uniqueRows = Array.from(new Set(allRows)).sort((a, b) => a - b);
  const headerRow = uniqueRows[0];
  const dataRows = uniqueRows.slice(1);

  const handleSubmit = () => {
    if (!selected || answered) return;
    onSubmit(selected);
  };

  const renderChart = () => {
    if (!selected) return null;

    const data = {
      labels: labels.map(l => l.length > 6 ? l.slice(0, 6) + '…' : l),
      datasets: [{ data: values }],
    };

    if (selected === 'column') {
      return (
        <BarChart
          data={data}
          width={chartWidth}
          height={200}
          chartConfig={CHART_CONFIG}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
        />
      );
    }

    if (selected === 'line') {
      return (
        <LineChart
          data={data}
          width={chartWidth}
          height={200}
          chartConfig={CHART_CONFIG}
          style={styles.chart}
          bezier
          fromZero
        />
      );
    }

    if (selected === 'pie') {
      const total = values.reduce((s, v) => s + v, 0) || 1;
      const PIE_COLORS = ['#217346', '#1565C0', '#E65100', '#00695C', '#4A148C', '#880E4F'];
      const pieData = labels.map((label, i) => ({
        name: label,
        population: values[i],
        color: PIE_COLORS[i % PIE_COLORS.length],
        legendFontColor: '#4A4A6A',
        legendFontSize: 12,
      }));
      return (
        <PieChart
          data={pieData}
          width={chartWidth}
          height={200}
          chartConfig={CHART_CONFIG}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="16"
          style={styles.chart}
        />
      );
    }

    if (selected === 'bar') {
      // Horizontal bar chart (custom native)
      const maxVal = Math.max(...values) || 1;
      return (
        <View style={styles.hBarContainer}>
          {labels.map((label, i) => (
            <View key={i} style={styles.hBarRow}>
              <Text style={styles.hBarLabel} numberOfLines={1}>{label}</Text>
              <View style={styles.hBarTrack}>
                <View style={[styles.hBarFill, { width: `${(values[i] / maxVal) * 100}%` as any }]} />
              </View>
              <Text style={styles.hBarValue}>{values[i]}</Text>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Data table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>{labelHeader}</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>{valueHeader}</Text>
        </View>
        {dataRows.map(r => (
          <View key={r} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellLeft]}>{String(cells[`A${r}`] ?? '')}</Text>
            <Text style={[styles.tableCell, styles.tableCellRight]}>{String(cells[`B${r}`] ?? '')}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Selecione o tipo de gráfico:</Text>

      {/* 2×2 chart type buttons */}
      <View style={styles.btnGrid}>
        {CHART_BUTTONS.map(btn => (
          <TouchableOpacity
            key={btn.type}
            style={[
              styles.typeBtn,
              selected === btn.type && styles.typeBtnSelected,
            ]}
            onPress={() => !answered && setSelected(btn.type)}
            activeOpacity={0.75}
            disabled={answered}
          >
            <Text style={styles.typeBtnIcon}>{btn.icon}</Text>
            <Text style={[styles.typeBtnLabel, selected === btn.type && styles.typeBtnLabelSelected]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart preview */}
      <View style={styles.chartArea}>
        {selected ? renderChart() : (
          <Text style={styles.chartPlaceholder}>Selecione um tipo para visualizar</Text>
        )}
      </View>

      {/* Confirm button */}
      <TouchableOpacity
        style={[styles.confirmBtn, (!selected || answered) && styles.confirmBtnDisabled]}
        onPress={handleSubmit}
        disabled={!selected || answered}
        activeOpacity={0.85}
      >
        <Text style={styles.confirmBtnText}>Confirmar Resposta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },

  /* Table */
  table: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D8E8D8',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E8F0E8',
  },
  tableHeader: {
    backgroundColor: '#217346',
    borderBottomWidth: 0,
  },
  tableCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: '700',
  },
  tableCellLeft: {
    color: '#1A1A2E',
    backgroundColor: '#fff',
    fontWeight: '500',
  },
  tableCellRight: {
    color: '#217346',
    backgroundColor: '#F7FBF7',
    fontWeight: '600',
    textAlign: 'right',
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A4A6A',
    letterSpacing: 0.3,
  },

  /* 2×2 grid */
  btnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  typeBtn: {
    width: '47%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D8E8D8',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  typeBtnSelected: {
    borderColor: '#217346',
    backgroundColor: '#E8F5E9',
  },
  typeBtnIcon: { fontSize: 28 },
  typeBtnLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A4A6A',
  },
  typeBtnLabelSelected: { color: '#217346' },

  /* Chart area */
  chartArea: {
    minHeight: 220,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E8E0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chart: { borderRadius: 8 },
  chartPlaceholder: {
    fontSize: 13,
    color: '#B0BEC5',
    fontStyle: 'italic',
  },

  /* Horizontal bar */
  hBarContainer: {
    width: '100%',
    padding: 12,
    gap: 10,
  },
  hBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hBarLabel: {
    width: 60,
    fontSize: 12,
    color: '#4A4A6A',
    fontWeight: '500',
  },
  hBarTrack: {
    flex: 1,
    height: 22,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  hBarFill: {
    height: '100%',
    backgroundColor: '#217346',
    borderRadius: 4,
  },
  hBarValue: {
    width: 48,
    fontSize: 12,
    color: '#217346',
    fontWeight: '700',
    textAlign: 'right',
  },

  /* Confirm button */
  confirmBtn: {
    backgroundColor: '#217346',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#217346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    elevation: 6,
  },
  confirmBtnDisabled: {
    backgroundColor: '#B0BEC5',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
