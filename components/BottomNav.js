import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { bottomNavStyles } from '../styles/bottomNavStyles';

const tabs = [
  { key: 'products', label: 'Home', icon: 'home-variant' },
  { key: 'cart', label: 'Cart', icon: 'cart' },
  { key: 'account', label: 'Account', icon: 'account-circle' },
];

export default function BottomNav({ activeScreen, onChange, cartCount }) {
  return (
    <View style={bottomNavStyles.nav}>
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
