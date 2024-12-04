import * as React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, Linking, TouchableHighlight } from "react-native";
import { Camera, useCameraDevices, useCameraPermission } from "react-native-vision-camera";
import * as ImagePicker from "react-native-image-picker";
import * as ExpoMediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HomeScreen() {
  const [cameraPosition, setCameraPosition] = React.useState("back");
  const [hasPermission, setHasPermission] = React.useState(true);
  const [isCameraRestricted, setIsCameraRestricted] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const camera = React.useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === cameraPosition);
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermission();
      const mediaLibraryStatus = await ExpoMediaLibrary.requestPermissionsAsync();
      if (cameraStatus === "restricted") {
              setIsCameraRestricted(true);
      }
      setHasPermission(cameraStatus === "granted" && mediaLibraryStatus.status === "granted");
    })();
  }, []);

  React.useEffect(() => {
    console.log("Available devices:", devices);
    console.log("Current camera position:", cameraPosition);
    console.log("Device:", device);
  }, [devices, cameraPosition, device]);

  const pickImage = async () => {
    try {
      const { status } = await ExpoMediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access media library is required!");
        return;
      }
      const options = {
        mediaType: "photo",
        quality: 1,
      };

      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          console.log("ImagePicker Response: ", response);
          if (response.assets && response.assets.length > 0) {
            setSelectedImage(response.assets[0].uri);
            console.log("Selected image URI:", response.assets[0].uri);
          } else {
            console.error("No assets found in response");
          }
        }
      });
    } catch (e) {
      console.error("Failed to pick image!", e);
    }
  };

  const takePicture = async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");

      console.log("Taking photo...");
      const photo = await camera.current.takePhoto({
        enableShutterSound: false,
      });
      router.push({
        pathname: "/media",
        params: { media: photo.path, type: "photo" },
      });
      // onMediaCaptured(photo, 'photo')
    } catch (e) {
      console.error("Failed to take photo!", e);
    }
  };

  if (isCameraRestricted) {
    return <View style={styles.container}><ThemedText type="title">Camera is restricted by the operating system.</ThemedText></View>;
  }
  if (!hasPermission) {
    return <View style={styles.container}><ThemedText type="title">Requesting permissions...</ThemedText></View>;
  }

  if (!device) {
    return <View style={styles.container}><ThemedText type="title">Loading camera...</ThemedText></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 5, borderRadius: 20, overflow: 'hidden'}}>
        <Camera ref={camera} style={{ flex: 1 }} device={device} isActive={true} photo={true}/>
      </View>
      <View style={{flex: 0.4}}>
        <Button
            iconSize={40}
            title="1x"
            onPress={() => setShowZoomControls((s) => !s)}
            containerStyle={{ alignSelf: "center" }}/>
        </View>
      <View style={{ flex: 0.3, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
          containerStyle={{ alignSelf: "center" }}
        />
      </View>
      <View style={{ flex: 0.7, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          iconName="image-outline"
          onPress={pickImage}
          containerStyle={{ alignSelf: "center" }}
        />
        <TouchableHighlight onPress={takePicture}>
                  <FontAwesome5 name="dot-circle" size={100} color={"white"} />
        </TouchableHighlight>
        <Button
          iconName="camera-reverse-outline"
          onPress={() => setCameraPosition((prev) => (prev === "back" ? "front" : "back"))}
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