import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, Linking } from "react-native";
import { Camera, useCameraDevices, useCameraPermission } from "react-native-vision-camera";
import * as ExpoMediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const [torch, setTorch] = useState("off");
  const [flash, setFlash] = useState("off");
  const [cameraPosition, setCameraPosition] = useState("back");
  const [hasPermission, setHasPermission] = useState(true);
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === cameraPosition);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermission();
      const mediaLibraryStatus = await ExpoMediaLibrary.requestPermissionsAsync();
      setHasPermission(cameraStatus === "authorized" || mediaLibraryStatus.status === "granted");
    })();
  }, []);

  useEffect(() => {
    console.log("Available devices:", devices);
    console.log("Current camera position:", cameraPosition);
    console.log("Device:", device);
  }, [devices, cameraPosition, device]);

  if (!hasPermission) {
    return <View style={styles.container}><ThemedText type="title">Requesting permissions...</ThemedText></View>;
  }

  if (!device) {
    return <View style={styles.container}><ThemedText type="title">Loading camera...</ThemedText></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} device={device} isActive={true} />
      </View>
      <View style={{ flex: 0.4, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
        <Button
          iconName="camera-reverse-outline"
          onPress={() => setCameraPosition((prev) => (prev === "back" ? "front" : "back"))}
          containerStyle={{ alignSelf: "center" }}
        />
        <Button
          iconName="image-outline"
          onPress={() => {
            const link = Platform.select({
              ios: "photos-redirect://",
              android: "content://media/external/images/media",
            });
            link && Linking.openURL(link);
          }}
          containerStyle={{ alignSelf: "center" }}
        />
        <Button
          iconName="settings-outline"
          onPress={() => router.push("/_sitemap")}
          onPress={() => router.push("/_sitemap")}
          containerStyle={{ alignSelf: "center" }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});