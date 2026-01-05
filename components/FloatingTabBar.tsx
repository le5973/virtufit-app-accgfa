
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter, usePathname } from 'expo-router';
import { Href } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { colors, shadows } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const handleTabPress = (route: Href) => {
    router.push(route);
  };

  const isActive = (tabName: string) => {
    return pathname.includes(tabName);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={[styles.container, { marginBottom: bottomMargin }]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.tabBar,
            {
              width: containerWidth,
              borderRadius: borderRadius,
            },
            shadows.large,
          ]}
        >
          {tabs.map((tab, index) => {
            const active = isActive(tab.name);
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => handleTabPress(tab.route)}
                style={[
                  styles.tab,
                  active && styles.tabActive,
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
                  <IconSymbol
                    android_material_icon_name={tab.icon}
                    size={24}
                    color={active ? colors.primary : '#FFFFFF'}
                  />
                </View>
                <Text
                  style={[
                    styles.label,
                    active && styles.labelActive,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  labelActive: {
    color: colors.primary,
    opacity: 1,
    fontWeight: '700',
  },
});
