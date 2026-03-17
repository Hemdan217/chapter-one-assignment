import React from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '../constants/theme';

export function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      </View>
      <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Dark mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.textOnPrimary}
          accessibilityLabel="Dark mode"
          accessibilityRole="switch"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
  },
});
