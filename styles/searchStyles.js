import { StyleSheet } from 'react-native';

export const searchStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dce7e2',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f4f7f6',
    borderWidth: 1,
    borderColor: '#cddbd5',
    borderRadius: 6,
    paddingHorizontal: 10,
    color: '#153d2e',
    fontSize: 13,
  },
});
