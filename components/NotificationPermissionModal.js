import { Modal, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { alertStyles } from '../styles/alertStyles';
import { notificationStyles } from '../styles/notificationStyles';

/**
 * Friendly explanation shown before Android's own "Allow notifications?" prompt.
 * When Android will no longer show its prompt (denied too often), the button opens the phone's Settings instead.
 */
export default function NotificationPermissionModal({ visible, canAskAgain, onAllow, onLater }) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onLater} statusBarTranslucent>
      <View style={alertStyles.backdrop}>
        <View style={alertStyles.card}>
          <View style={[alertStyles.iconCircle, { backgroundColor: '#e8f7f1' }]}>
            <MaterialCommunityIcons name="bell-ring-outline" size={40} color="#16835f" />
          </View>
          <Text style={alertStyles.title}>Get Offer Alerts</Text>
          <Text style={alertStyles.message}>
            {canAskAgain
              ? 'Turn on notifications to be the first to know about medicine discounts, new stock and order updates.'
              : 'Notifications are turned off for Med Bangladesh. Open Settings and allow notifications to get medicine offers and updates.'}
          </Text>
          <View style={notificationStyles.buttonRow}>
            <TouchableOpacity style={notificationStyles.secondaryButton} onPress={onLater} activeOpacity={0.85}>
              <Text style={notificationStyles.secondaryButtonText}>Not Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={notificationStyles.primaryButton} onPress={onAllow} activeOpacity={0.85}>
              <Text style={notificationStyles.primaryButtonText}>{canAskAgain ? 'Turn On' : 'Open Settings'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
