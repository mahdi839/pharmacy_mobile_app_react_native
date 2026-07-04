import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  sliderSection: {
    paddingTop: 10,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 9,
  },
  sliderTitle: {
    color: '#173d31',
    fontSize: 18,
    fontWeight: '900',
  },
  sliderTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#cddbd5',
  },
  sliderArrows: {
    flexDirection: 'row',
    gap: 6,
  },
  sliderArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b8d2c7',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderList: {
    paddingBottom: 8,
  },
  sliderCard: {
    marginBottom: 0,
  },
  bannerSection: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  bannerImage: {
    aspectRatio: 3,
    borderRadius: 8,
    backgroundColor: '#e8f5ef',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 7,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#b8cbc3',
  },
  bannerDotActive: {
    width: 16,
    backgroundColor: '#1a7f5a',
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
