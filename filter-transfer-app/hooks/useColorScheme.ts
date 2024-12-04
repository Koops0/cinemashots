import { useColorScheme as _useColorScheme } from 'react-native';

export function useColorScheme() {
  return 'dark' || _useColorScheme();
}