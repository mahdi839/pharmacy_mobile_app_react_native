import { Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CartIcon from './CartIcon';
import { navbarStyles } from '../styles/navbarStyles';

export default function Navbar({ cartCount = 0, onCartPress }) {
  return (
    <View style={navbarStyles.navbar}>
      <View style={navbarStyles.logoWrap}>
        <View style={navbarStyles.logoIcon}>
          <FontAwesome5 name="capsules" size={24} color="#0f5f45"/>
          {/* <MaterialCommunityIcons name="medical-bag" size={24}  /> */}
        </View>
        <View>
          <Text style={navbarStyles.logoMad}>MED</Text>
          <Text style={navbarStyles.logoBangladesh}>Bangladesh</Text>
        </View>
      </View>
      <CartIcon count={cartCount} onPress={onCartPress} />
    </View>
  );
}
