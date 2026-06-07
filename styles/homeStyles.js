import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  sliderSection: {
    paddingTop: 10,
  },
  sliderHeader: {
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  sliderTitle: {
    color: '#173d31',
    fontSize: 18,
    fontWeight: '900',
  },
  sliderList: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    gap: 10,
  },
  sliderCard: {
    width: 174,
    marginRight: 10,
  },
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce7e2',
    padding: 14,
    marginBottom: 12,
  },
  accountName: {
    color: '#173d31',
    fontSize: 20,
    fontWeight: '900',
  },
  accountMeta: {
    color: '#657870',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5ef',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  statusText: {
    color: '#14543e',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  orderRow: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce7e2',
    padding: 12,
    marginBottom: 10,
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  orderNumber: {
    color: '#173d31',
    fontSize: 14,
    fontWeight: '900',
  },
  orderMeta: {
    color: '#657870',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
  },
  sectionTitle: {
    color: '#173d31',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 10,
  },
});
