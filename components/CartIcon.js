import { Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { navbarStyles } from '../styles/navbarStyles';

export default function CartIcon({ count = 0 }) {
  return (
    <TouchableOpacity style={navbarStyles.cartButton} activeOpacity={0.8}>
      <FontAwesome name="shopping-cart" size={22} color="#ffffff" />
      {count > 0 && (
        <View style={navbarStyles.badge}>
          <Text style={navbarStyles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
