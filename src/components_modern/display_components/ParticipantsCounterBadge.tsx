import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getModernColors } from '../core/modernTheme';

export type BadgePosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface ParticipantsCounterBadgeOptions {
  participantsCount: number;
  position?: BadgePosition;
  showBadge?: boolean;
  backgroundColor?: string;
  textColor?: string;
  isDarkMode?: boolean;
  customStyle?: StyleProp<ViewStyle>;
}

export interface ParticipantsCounterBadgeProps extends ParticipantsCounterBadgeOptions {
  options?: ParticipantsCounterBadgeOptions;
}

const getPositionStyle = (position: BadgePosition): ViewStyle => {
  const offset = 16;
  const positions: Record<BadgePosition, ViewStyle> = {
    topLeft: { top: offset, left: offset },
    topRight: { top: offset, right: offset },
    bottomLeft: { bottom: offset, left: offset },
    bottomRight: { bottom: offset, right: offset },
  };
  return positions[position];
};

export const ParticipantsCounterBadge: React.FC<ParticipantsCounterBadgeProps> = ({
  options,
  participantsCount: countProp,
  position: positionProp,
  showBadge: showBadgeProp,
  backgroundColor: backgroundColorProp,
  textColor: textColorProp,
  isDarkMode: isDarkModeProp,
  customStyle,
}) => {
  const participantsCount = options?.participantsCount ?? countProp ?? 0;
  const position = options?.position ?? positionProp ?? 'bottomLeft';
  const showBadge = options?.showBadge ?? showBadgeProp ?? true;
  const isDarkMode = options?.isDarkMode ?? isDarkModeProp ?? true;
  const colors = getModernColors(isDarkMode);
  const backgroundColor = options?.backgroundColor ?? backgroundColorProp ?? (isDarkMode ? 'rgba(45, 52, 54, 0.85)' : 'rgba(255, 255, 255, 0.9)');
  const textColor = options?.textColor ?? textColorProp ?? colors.text;

  if (!showBadge) {
    return null;
  }

  return (
    <View style={[styles.container, getPositionStyle(position), customStyle]}>
      <View style={[styles.badge, { backgroundColor, borderColor: colors.border }]}>
        <FontAwesome5 name="users" size={14} color={textColor} style={styles.icon} />
        <Text style={[styles.count, { color: textColor }]}>{participantsCount}</Text>
      </View>
    </View>
  );
};

export default ParticipantsCounterBadge;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  icon: {
    opacity: 0.9,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
  },
});