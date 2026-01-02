
import React from "react";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { ModalDemo } from "./homeData";
import { GlassView } from "expo-glass-effect";

interface DemoCardProps {
  item: ModalDemo;
}

export function DemoCard({ item }: DemoCardProps) {
  const theme = useTheme();

  return (
    <GlassView
      style={[
        styles.demoCard,
        { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
      ]}
      glassEffectStyle="regular"
    >
      <View style={[styles.demoIcon, { backgroundColor: item.color }]}>
        <IconSymbol ios_icon_name="square.grid.3x3" android_material_icon_name="apps" color={theme.dark ? '#111111' : '#FFFFFF'} size={16} />
      </View>
      <View style={styles.demoContent}>
        <Text style={[styles.demoTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.demoDescription, { color: theme.dark ? '#98989D' : '#666' }]}>
          {item.description}
        </Text>
      </View>
      <Link href={item.route as any} asChild>
        <Pressable>
          <View
            style={[
              styles.tryButton,
              { backgroundColor: theme.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }
            ]}
          >
            <Text style={[styles.tryButtonText, { color: theme.colors.primary }]}>
              Try
            </Text>
          </View>
        </Pressable>
      </Link>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  demoCard: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  demoContent: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  demoDescription: {
    fontSize: 11,
    lineHeight: 14,
  },
  tryButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  tryButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
