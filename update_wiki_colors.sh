#!/bin/bash

FILE="/home/ubuntu/arena_excel/react_native_space/src/screens/main/WikiExcelScreen.tsx"

# Atualizar todas as cores das categorias para verde
sed -i "s/cor: '#6A1B9A'/cor: theme.colors.primary/g" "$FILE"
sed -i "s/cor: '#E65100'/cor: theme.colors.primaryMid/g" "$FILE"
sed -i "s/cor: '#00695C'/cor: theme.colors.primary/g" "$FILE"
sed -i "s/cor: '#C62828'/cor: theme.colors.primaryMid/g" "$FILE"
sed -i "s/cor: '#4527A0'/cor: theme.colors.primary/g" "$FILE"
sed -i "s/cor: '#1976D2'/cor: theme.colors.primaryMid/g" "$FILE"
sed -i "s/cor: '#AD1457'/cor: theme.colors.primary/g" "$FILE"
sed -i "s/cor: '#37474F'/cor: theme.colors.primaryMid/g" "$FILE"

# Atualizar corClara
sed -i "s/corClara: '#F3E5F5'/corClara: theme.colors.primaryLight/g" "$FILE"
sed -i "s/corClara: '#FFF3E0'/corClara: theme.colors.primaryLight/g" "$FILE"
sed -i "s/corClara: '#E0F2F1'/corClara: theme.colors.primaryLight/g" "$FILE"
sed -i "s/corClara: '#FFEBEE'/corClara: theme.colors.primaryLight/g" "$FILE"
sed -i "s/corClara: '#EDE7F6'/corClara: theme.colors.primaryLight/g" "$FILE"
sed -i "s/corClara: '#E3F2FD'/corClara: theme.colors.primaryLight/g" "$FILE"
sed -i "s/corClara: '#FCE4EC'/corClara: theme.colors.primaryLight/g" "$FILE"
sed -i "s/corClara: '#ECEFF1'/corClara: theme.colors.primaryLight/g" "$FILE"

# Atualizar header
sed -i "s/backgroundColor: '#E65100'/backgroundColor: theme.colors.primary/g" "$FILE"
sed -i "s/backgroundColor: '#1E88E5'/backgroundColor: theme.colors.primary/g" "$FILE"

# Atualizar badges e outros elementos
sed -i "s/color: '#E65100'/color: theme.colors.primary/g" "$FILE"
sed -i "s/borderLeftColor: '#E65100'/borderLeftColor: theme.colors.primary/g" "$FILE"

echo "✅ Cores atualizadas no WikiExcelScreen!"
