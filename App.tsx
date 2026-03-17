import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/constants/theme';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Tab = 'todos' | 'settings';

/** Root content: tab bar (Todos | Settings) and theme-aware StatusBar. Task state is in useTasks inside HomeScreen. */
function AppContent() {
  const { theme, isDark } = useTheme();
  const [tab, setTab] = useState<Tab>('todos');

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          {tab === 'todos' ? <HomeScreen /> : <SettingsScreen />}
        </View>
        <View style={[styles.tabBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <Pressable
            style={styles.tab}
            onPress={() => setTab('todos')}
          >
            <Ionicons
              name="list"
              size={24}
              color={tab === 'todos' ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: tab === 'todos' ? theme.colors.primary : theme.colors.textMuted },
              ]}
            >
              Todos
            </Text>
          </Pressable>
          <Pressable
            style={styles.tab}
            onPress={() => setTab('settings')}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={tab === 'settings' ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: tab === 'settings' ? theme.colors.primary : theme.colors.textMuted },
              ]}
            >
              Settings
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 24,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
