
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import React from 'react';
import { colors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter, usePathname } from 'expo-router';

export interface TabBarItem {
  name: string;
  route: Href;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FloatingTabBar({
  tabs,
  containerWidth = SCREEN_WIDTH * 0.75, // Reduced from 0.9 to 0.75
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const activeIndex = tabs.findIndex((tab) => pathname.includes(tab.name));
  const indicatorPosition = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  const handleTabPress = (route: Href, index: number) => {
    indicatorPosition.value = withSpring(index, {
      damping: 15,
      stiffness: 150,
    });
    router.push(route);
  };

  const tabWidth = containerWidth / tabs.length;

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            indicatorPosition.value,
            [0, tabs.length - 1],
            [0, containerWidth - tabWidth]
          ),
        },
      ],
    };
  });

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { marginBottom: bottomMargin }]}
    >
      <BlurView intensity={80} tint="dark" style={[styles.tabBar, { width: containerWidth, borderRadius }]}>
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            {
              width: tabWidth,
              borderRadius: borderRadius - 5,
            },
          ]}
        />
        {tabs.map((tab, index) => {
          const isActive = pathname.includes(tab.name);
          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tab, { width: tabWidth }]}
              onPress={() => handleTabPress(tab.route, index)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={tab.icon as any}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.primary : colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    height: '70%',
    backgroundColor: colors.surface,
    opacity: 0.3,
    zIndex: 1,
    top: '15%',
  },
});
