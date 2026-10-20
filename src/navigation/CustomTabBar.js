import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, fonts, sizes } from '../theme';

const { width } = Dimensions.get('window');

const TAB_BAR_HEIGHT = 65;
const CIRCLE_SIZE = 58;
const CIRCLE_LIFT = 26; // how much the circle sticks above the bar

// Draws the tab bar with a smooth inward curve around the center
const TabBarBackground = ({ width: w, height: h }) => {
  const center = w / 2;
  const notchWidth = 80;   // total width of the curve area
  const notchDepth = 26;   // how deep the curve dips

  // Path: left edge → flat → smooth dip → flat → right edge
  const d = `
    M0,0
    L${center - notchWidth / 2},0
    C${center - notchWidth / 4},0 ${center - notchWidth / 4},${notchDepth} ${center},${notchDepth}
    C${center + notchWidth / 4},${notchDepth} ${center + notchWidth / 4},0 ${center + notchWidth / 2},0
    L${w},0
    L${w},${h}
    L0,${h}
    Z
  `;

  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Path d={d} fill="#FFFFFF" />
    </Svg>
  );
};

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  const tabs = state.routes;

  return (
    <View style={styles.wrapper}>
      {/* Shadow container */}
      <View style={styles.barContainer}>
        <TabBarBackground width={width} height={TAB_BAR_HEIGHT} />

        <View style={styles.row}>
          {tabs.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel ?? options.title ?? route.name;
            const isFocused = state.index === index;
            const isCenter = index === Math.floor(tabs.length / 2);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const iconName = getIcon(route.name, isFocused);

            // Center floating button
            if (isCenter) {
              return (
                <View key={route.key} style={styles.tabItem}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={onPress}
                    style={styles.centerButton}
                  >
                    <Icon name={iconName} size={26} color="#fff" />
                  </TouchableOpacity>
                  <Text style={[styles.label, styles.centerLabel]}>
                    {label}
                  </Text>
                </View>
              );
            }

            // Regular tab
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={onPress}
                activeOpacity={0.7}
              >
                <Icon
                  name={iconName}
                  size={22}
                  color={isFocused ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused ? colors.primary : colors.textMuted,
                      fontFamily: isFocused
                        ? fonts.family.semibold
                        : fonts.family.medium,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// Map route names to Ionicons
const getIcon = (name, focused) => {
  switch (name) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Calendar':
      return focused ? 'calendar' : 'calendar-outline';
    case 'Expense':
      return 'add'; // plus icon inside the circle
    case 'Statistic':
      return focused ? 'stats-chart' : 'stats-chart-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    default:
      return 'ellipse-outline';
  }
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT + CIRCLE_LIFT,
    backgroundColor: 'transparent',
  },
  barContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android shadow
    elevation: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
  },
  label: {
    fontSize: sizes.xs || 11,
    marginTop: 4,
  },
  centerLabel: {
    marginTop: CIRCLE_LIFT + 6,
    color: colors.primary,
    fontFamily: fonts.family.semibold,
  },
  centerButton: {
    position: 'absolute',
    top: -CIRCLE_LIFT,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow around circle
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#fff',
  },
});