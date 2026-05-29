import { StyleSheet } from 'react-native';

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  productList: {
    padding: 10,
    paddingBottom: 32,
    flexGrow: 1,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  loadingBox: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  messageBox: {
    backgroundColor: '#fff0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0c6c6',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  errorText: {
    color: '#8a1f1f',
    fontSize: 13,
  },
  emptyText: {
    color: '#61756d',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 28,
  },
});
