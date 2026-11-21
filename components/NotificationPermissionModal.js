import { Modal, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { alertStyles } from '../styles/alertStyles';
import { notificationStyles } from '../styles/notificationStyles';

/**
 * Friendly explanation shown before Android's own "Allow notifications?" prompt.
 * "Turn On" always tries Android's prompt first; the app opens Settings only if Android refuses to show it.
 */
export default function NotificationPermissionModal({ visible, onAllow, onLater }) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onLater} statusBarTranslucent>
      <View style={alertStyles.backdrop}>
        <View style={alertStyles.card}>
          <View style={[alertStyles.iconCircle, { backgroundColor: '#e8f7f1' }]}>
            <MaterialCommunityIcons name="bell-ring-outline" size={40} color="#16835f" />
          </View>
          <Text style={alertStyles.title}>Get Offer Alerts</Text>
          <Text style={alertStyles.message}>
            Turn on notifications to be the first to know about medicine discounts, new stock and order updates.
          </Text>
          <View style={notificationStyles.buttonRow}>
            <TouchableOpacity style={notificationStyles.secondaryButton} onPress={onLater} activeOpacity={0.85}>
              <Text style={notificationStyles.secondaryButtonText}>Not Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={notificationStyles.primaryButton} onPress={onAllow} activeOpacity={0.85}>
              <Text style={notificationStyles.primaryButtonText}>Turn On</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
