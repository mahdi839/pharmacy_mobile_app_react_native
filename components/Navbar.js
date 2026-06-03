import { Text, View } from 'react-native';

import CartIcon from './CartIcon';
import { navbarStyles } from '../styles/navbarStyles';

export default function Navbar({ cartCount = 0, onCartPress }) {
  return (
    <View style={navbarStyles.navbar}>
      <Text style={navbarStyles.logo}>Mad Bangladesh</Text>
      <CartIcon count={cartCount} onPress={onCartPress} />
    </View>
  );
}
