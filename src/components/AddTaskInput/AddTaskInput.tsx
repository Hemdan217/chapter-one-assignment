import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import { copy } from '../../constants/copy';

interface AddTaskInputProps {
  onAdd: (title: string) => void;
}

export function AddTaskInput({ onAdd }: AddTaskInputProps) {
  const { theme } = useTheme();
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          backgroundColor: theme.colors.background,
        },
        bar: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.xs,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        input: {
          flex: 1,
          height: 44,
          paddingRight: theme.spacing.sm,
          fontSize: theme.fontSize.md,
          color: theme.colors.text,
        },
        button: {
          width: 44,
          height: 44,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radius.sm,
        },
        buttonPressed: { opacity: 0.8 },
      }),
    [theme]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.wrapper}>
        <View style={styles.bar}>
          <TextInput
            style={styles.input}
            placeholder={copy.addTaskPlaceholder}
            placeholderTextColor={theme.colors.textMuted}
            value={value}
            onChangeText={setValue}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleSubmit}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
