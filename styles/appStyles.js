import { StyleSheet } from 'react-native';

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  screenBody: {
    flex: 1,
  },
  productsScreen: {
    flex: 1,
  },
  productList: {
    padding: 10,
    paddingBottom: 24,
    flexGrow: 1,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchResultTitle: {
    color: '#173d31',
    fontSize: 18,
    fontWeight: '900',
  },
  searchResultCount: {
    color: '#6a7e76',
    fontSize: 12,
    fontWeight: '700',
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
