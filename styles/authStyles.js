import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    justifyContent: 'center',
    padding: 20,
  },
  scrollPage: {
    flexGrow: 1,
    backgroundColor: '#f4f7f6',
    justifyContent: 'center',
    padding: 20,
  },
  brand: {
    color: '#12372f',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    color: '#60746c',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce7e2',
    padding: 16,
  },
  title: {
    color: '#173d31',
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 14,
  },
  label: {
    color: '#31463e',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#cddbd5',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 76,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1a7f5a',
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  switchText: {
    color: '#14543e',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 16,
    textAlign: 'center',
  },
  error: {
    color: '#8a1f1f',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
});
