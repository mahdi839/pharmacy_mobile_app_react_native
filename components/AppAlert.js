import { Modal, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { alertStyles } from '../styles/alertStyles';

const alertTheme = {
  success: { icon: 'check', color: '#16835f', background: '#e8f7f1' },
  error: { icon: 'close', color: '#c23b32', background: '#fff0ef' },
  warning: { icon: 'alert-outline', color: '#c47a13', background: '#fff6e7' },
};

export default function AppAlert({ alert, onClose }) {
  const theme = alertTheme[alert?.type] || alertTheme.success;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={Boolean(alert)}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={alertStyles.backdrop}>
        <View style={alertStyles.card}>
          <View style={[alertStyles.iconCircle, { backgroundColor: theme.background }]}> 
            <MaterialCommunityIcons name={theme.icon} size={42} color={theme.color} />
          </View>
          <Text style={alertStyles.title}>{alert?.title}</Text>
          <Text style={alertStyles.message}>{alert?.message}</Text>
          <TouchableOpacity
            style={[alertStyles.button, { backgroundColor: theme.color }]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={alertStyles.buttonText}>{alert?.buttonText || 'OK'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
