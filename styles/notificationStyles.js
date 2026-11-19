import { StyleSheet } from 'react-native';

export const notificationStyles = StyleSheet.create({
  // Inbox
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dce7e2',
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#173d31',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptyText: {
    color: '#657870',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dce7e2',
    marginBottom: 12,
    overflow: 'hidden',
  },
  unreadItem: {
    borderColor: '#1a7f5a',
    backgroundColor: '#f4fbf8',
  },
  itemImage: {
    width: '100%',
    aspectRatio: 2,
    backgroundColor: '#eef4f1',
  },
  itemBody: {
    padding: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#1a7f5a',
    marginTop: 6,
  },
  itemTitle: {
    flex: 1,
    color: '#173d31',
    fontSize: 15,
    fontWeight: '800',
  },
  itemTime: {
    color: '#7a8b84',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  itemText: {
    color: '#4f625b',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  itemLink: {
    color: '#1a7f5a',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 10,
  },
  errorText: {
    color: '#c23b32',
    fontSize: 13,
    marginBottom: 12,
  },

  // Shared modal buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1a7f5a',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#eef4f1',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#173d31',
    fontSize: 14,
    fontWeight: '800',
  },
  disabledButton: {
    backgroundColor: '#9fb3ab',
  },

  // Product detail modal
  productCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#eef4f1',
  },
  productBody: {
    padding: 18,
  },
  productName: {
    color: '#173d31',
    fontSize: 20,
    fontWeight: '900',
  },
  productMeta: {
    color: '#657870',
    fontSize: 13,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 12,
  },
  productPrice: {
    color: '#1a7f5a',
    fontSize: 20,
    fontWeight: '900',
  },
  productMrp: {
    color: '#7a8b84',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#ff4757',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  stockText: {
    color: '#657870',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 16,
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
  },
});
