import { StyleSheet } from 'react-native';

export const bottomNavStyles = StyleSheet.create({
  nav: {
    height: 68,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#dce7e2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  label: {
    color: '#7a8b84',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  activeLabel: {
    color: '#1a7f5a',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 19,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
});
