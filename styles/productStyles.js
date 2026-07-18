import { StyleSheet } from 'react-native';

export const productStyles = StyleSheet.create({
  card: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dce7e2',
  },
  imageWrap: {
    height: 104,
    backgroundColor: '#eef4f1',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    left: 0,
    top: 3,
    backgroundColor: '#e43d30',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  productInfo: {
    minHeight: 54,
    flex: 1,
  },
  productName: {
    color: '#153d2e',
    fontSize: 15,
    fontWeight: '700',
  },
  companyName: {
    color: '#5b7068',
    fontSize: 12,
    marginTop: 4,
  },
  price: {
    color: '#1a7f5a',
    fontSize: 15,
    fontWeight: '800',
  },
  mrp: {
    color: '#7a8b84',
    fontSize: 11,
    marginTop: 3,
    textDecorationLine: 'line-through',
  },
  details: {
    color: '#31463e',
    fontSize: 12,
    marginTop: 8,
  },
  priceRow: {
    minHeight: 36,
    marginTop: 8,
  },
  stock: {
    color: '#5b7068',
    fontSize: 11,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#1a7f5a',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  outOfStockButton: {
    backgroundColor: '#e0500d',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
