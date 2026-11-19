import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { bottomNavStyles } from '../styles/bottomNavStyles';

const tabs = [
  { key: 'products', label: 'Home', icon: 'home-variant' },
  { key: 'cart', label: 'Cart', icon: 'cart' },
  { key: 'notifications', label: 'Notify', icon: 'bell' },
  { key: 'account', label: 'Account', icon: 'account-circle' },
];

export default function BottomNav({ activeScreen, onChange, cartCount, unreadCount = 0 }) {
  // Space taken by Android's navigation bar (0 when it is hidden).
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        bottomNavStyles.nav,
        { height: bottomNavStyles.nav.height + bottom, paddingBottom: bottomNavStyles.nav.paddingBottom + bottom },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeScreen === tab.key || (tab.key === 'cart' && activeScreen === 'checkout');

        return (
          <TouchableOpacity
            key={tab.key}
            style={bottomNavStyles.item}
            activeOpacity={0.8}
            onPress={() => onChange(tab.key)}
          >
            <View>
              <MaterialCommunityIcons
                name={tab.icon}
                size={24}
                color={isActive ? '#1a7f5a' : '#7a8b84'}
              />
              {tab.key === 'cart' ? (
                <View style={bottomNavStyles.badge}>
                  <Text style={bottomNavStyles.badgeText}>{cartCount}</Text>
                </View>
              ) : null}
              {tab.key === 'notifications' && unreadCount > 0 ? (
                <View style={bottomNavStyles.badge}>
                  <Text style={bottomNavStyles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[bottomNavStyles.label, isActive ? bottomNavStyles.activeLabel : null]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
