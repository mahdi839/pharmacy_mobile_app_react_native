import { Text, View } from 'react-native';

import CartIcon from './CartIcon';
import { navbarStyles } from '../styles/navbarStyles';

export default function Navbar({ cartCount = 0 }) {
  return (
    <View style={navbarStyles.navbar}>
      <Text style={navbarStyles.logo}>Med Bangladesh</Text>
      <CartIcon count={cartCount} />
    </View>
  );
}
