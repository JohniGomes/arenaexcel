import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  items: string[];   // shuffled items from correctOrder
  onSubmit: (value: string) => void;
  answered: boolean;
}

export default function DragDropQuestion({ items, onSubmit, answered }: Props) {
  const [slots, setSlots] = useState<(number | null)[]>(
    Array(items.length).fill(null)
  );

  const chipClick = (chipIdx: number) => {
    if (answered) return;
    const nextEmpty = slots.indexOf(null);
    if (nextEmpty === -1) return;
    const updated = [...slots];
    updated[nextEmpty] = chipIdx;
    setSlots(updated);
  };

  const slotClick = (slotIdx: number) => {
    if (answered || slots[slotIdx] === null) return;
    const updated = [...slots];
    updated[slotIdx] = null;
    setSlots(updated);
  };

  const allFilled = slots.every(s => s !== null);

  const handleSubmit = () => {
    if (!allFilled || answered) return;
    const order = slots.map(i => items[i!]);
    onSubmit(JSON.stringify(order));
  };

  return (
    <View style={styles.container}>
      {/* Numbered slots */}
      {slots.map((chipIdx, i) => {
        const filled = chipIdx !== null;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.slot, filled && styles.slotFilled]}
            onPress={() => slotClick(i)}
            activeOpacity={filled ? 0.75 : 1}
          >
            <View style={[styles.slotNum, filled && styles.slotNumFilled]}>
              <Text style={[styles.slotNumText, filled && styles.slotNumTextFilled]}>
                {i + 1}
              </Text>
            </View>
            <Text
              style={[styles.slotLabel, filled && styles.slotLabelFilled]}
              numberOfLines={2}
            >
              {filled ? items[chipIdx!] : '—'}
            </Text>
            {filled && <Text style={styles.undo}>✕</Text>}
          </TouchableOpacity>
        );
      })}

      <Text style={styles.sectionLabel}>Toque para selecionar:</Text>

      {/* Chips em grade 2 colunas */}
      <View style={styles.grid}>
        {items.map((item, i) => {
          const used = slots.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[styles.chip, used && styles.chipUsed]}
              onPress={() => chipClick(i)}
              disabled={used || answered}
              activeOpacity={0.7}
            >
              {used ? (
                <Text style={styles.chipDoneText}>✓</Text>
              ) : (
                <Text style={styles.chipText} numberOfLines={3}>{item}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Confirmar */}
      <TouchableOpacity
        style={[styles.btn, (!allFilled || answered) && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={!allFilled || answered}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Confirmar Resposta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },

  /* Slots */
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#217346',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  slotFilled: {
    borderStyle: 'solid',
    backgroundColor: '#217346',
  },
  slotNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E8F5E9',
    borderWidth: 1.5,
    borderColor: '#217346',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  slotNumFilled: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  slotNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#217346',
  },
  slotNumTextFilled: { color: '#fff' },
  slotLabel: {
    flex: 1,
    fontSize: 13,
    color: '#B0BEC5',
  },
  slotLabelFilled: {
    color: '#fff',
    fontWeight: '600',
  },
  undo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A4A6A',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* Chips grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#217346',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  chipUsed: {
    borderColor: '#E0E5E0',
    backgroundColor: '#F7F9F7',
  },
  chipText: {
    fontSize: 13,
    color: '#1A1A2E',
    fontWeight: '500',
    textAlign: 'center',
  },
  chipDoneText: {
    fontSize: 18,
    color: '#B0BEC5',
  },

  /* Confirm button */
  btn: {
    backgroundColor: '#217346',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#217346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    elevation: 6,
  },
  btnDisabled: {
    backgroundColor: '#B0BEC5',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
