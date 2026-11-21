import { Modal, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { alertStyles } from '../styles/alertStyles';
import { notificationStyles } from '../styles/notificationStyles';

/**
 * "Update Available" popup. When the update is required there is no "Later" button
 * and Android's back button cannot close it.
 */
export default function AppUpdateModal({ update, onUpdate, onLater }) {
  const isRequired = Boolean(update?.required);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={Boolean(update)}
      onRequestClose={isRequired ? () => {} : onLater}
      statusBarTranslucent
    >
      <View style={alertStyles.backdrop}>
        <View style={alertStyles.card}>
          <View style={[alertStyles.iconCircle, { backgroundColor: '#e8f7f1' }]}>
            <MaterialCommunityIcons name="cellphone-arrow-down" size={40} color="#16835f" />
          </View>
          <Text style={alertStyles.title}>{isRequired ? 'Update Required' : 'Update Available'}</Text>
          <Text style={alertStyles.message}>
            {update?.message}
            {isRequired ? '\n\nThis version can no longer be used. Please update to continue.' : ''}
          </Text>
          <View style={notificationStyles.buttonRow}>
            {isRequired ? null : (
              <TouchableOpacity style={notificationStyles.secondaryButton} onPress={onLater} activeOpacity={0.85}>
                <Text style={notificationStyles.secondaryButtonText}>Later</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={notificationStyles.primaryButton} onPress={onUpdate} activeOpacity={0.85}>
              <Text style={notificationStyles.primaryButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
