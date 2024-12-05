import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';
import { Camera } from 'react-native-vision-camera';
import * as ExpoMediaLibrary from 'expo-media-library';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [permissionsChecked, setPermissionsChecked] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermission();
        const mediaLibraryStatus = await ExpoMediaLibrary.requestPermissionsAsync();
        const microphoneStatus = await Camera.requestMicrophonePermission();

        if (
          cameraStatus !== 'granted' ||
          mediaLibraryStatus.status !== 'granted' ||
          microphoneStatus !== 'granted'
        ) {
          SplashScreen.hideAsync(); // Ensure splash screen is hidden before navigation
          setPermissionsChecked(false);
        } else {
          setPermissionsChecked(true);
          SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Failed to check permissions:', error);
        SplashScreen.hideAsync(); // Hide splash screen in case of errors
      }
    };

    if (loaded) {
      checkPermissions();
    }
  }, [loaded]);

  if (!loaded || !permissionsChecked) {
    return null; // Prevent rendering until permissions are checked
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="permissions" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
