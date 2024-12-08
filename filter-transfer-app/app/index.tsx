import * as React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, Linking, TouchableHighlight, Dimensions } from "react-native";
import { Camera, useCameraDevices, useCameraPermission, useFrameProcessor} from "react-native-vision-camera";
import * as ImagePicker from "react-native-image-picker";
import * as ExpoMediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import Slider from "@react-native-community/slider";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomThumb from "@/components/Thumb";
import { Asset } from 'expo-asset';
import labels from '../assets/labels.json';
import { TensorFlowModel, useTensorflowModel } from 'react-native-fast-tflite';

export default function HomeScreen() {
  const [cameraPosition, setCameraPosition] = React.useState("back");
  const [hasPermission, setHasPermission] = React.useState(true);
  const [isCameraRestricted, setIsCameraRestricted] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState(device?.neutralZoom || 0);
  const [isRecording, setIsRecording] = React.useState(false);
  const [willRecord, setWillRecord] = React.useState(false);
  const [modelUri, setModelUri] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

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
    console.log(device.minZoom, device.maxZoom, device.neutralZoom);
  }, [devices, cameraPosition, device]);

  // Always initialize the plugin
  const plugin = useTensorflowModel(require('./assets/imagemodel.tflite'))

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

  const zoomChange = (value: number) => {
    if (device?.maxZoom != null) {
        const newZoom = value * device.maxZoom;
        setZoom(newZoom);
    }
  }

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

const startRecording = async () => {
  try {
    if (camera.current == null) throw new Error("Camera ref is null!");

    console.log("Starting video recording...");
    await camera.current.startRecording({
      audio: true, // Enable audio recording
      onRecordingFinished: (video) => {
        if (video && video.path) {
          console.log("Video recording finished:", video);
          router.push({
            pathname: "/media",
            params: { media: video.path, type: "video" },
          });
        } else {
          console.error("Recording finished but video object is undefined or missing path");
        }
      },
      onRecordingError: (error) => {
        console.error("Recording error:", error);
      },
    });
    setIsRecording(true);
  } catch (e) {
    console.error("Failed to start video recording!", e);
  }
};

const stopRecording = async () => {
  try {
    if (camera.current == null) throw new Error("Camera ref is null!");

    console.log("Stopping video recording...");
    // Ensure a minimum recording duration
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const video = await camera.current.stopRecording();
    setIsRecording(false);

    if (video && video.path) {
      console.log("Video recording stopped:", video.path);
      router.push({
        pathname: "/media",
        params: { media: video.path, type: "video" },
      });
    } else {
      console.error("Recording stopped but no video data received");
    }
  } catch (e) {
    console.error("Failed to stop recording!", e);
  }
};

{/* toggle between taking a photo and recording video*/}
const toggleCapture = () => {
    if (willRecord) {
        setWillRecord(false);
    } else {
        setWillRecord(true);
    }

    {/* pop up about changing modes */}
    if (willRecord) {
        console.log("Switching to photo mode...");
    } else {
        console.log("Switching to video mode...");
    }
}
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        console.log(`Received a ${frame.width} x ${frame.height} Frame!`)
     }, [])

  if (isCameraRestricted) {
    return <View style={styles.container}><ThemedText type="title">Camera is restricted by the operating system.</ThemedText></View>;
  }
  if (!hasPermission) {
    return <View style={styles.container}><ThemedText type="title">Requesting permissions...</ThemedText></View>;
  }

  if (!device) {
    return <View style={styles.container}><ThemedText type="title">Loading camera...</ThemedText></View>;
  }

  const { width: screenWidth } = Dimensions.get('window');
  const full = screenWidth;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 5, borderRadius: 20, overflow: 'hidden'}}>
        <Camera ref={camera} style={{ flex: 1 }} device={device} isActive={true} zoom={zoom} video={true} photo={true} audio={true} frameProcessor={frameProcessor}/>
      </View>
      <View style={{ flex: 0.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ThemedText style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 10 }}>
          {`${(zoom).toFixed(1)}x`}
        </ThemedText>
        <Slider
          style={{ width: full - 60, height: 40 }} // Adjust width to fit the screen with some margin
          minimumValue={device.minZoom/ (device.maxZoom || 1)}
          maximumValue={1}
          value={zoom / (device.maxZoom || 1)}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FFFFFF"
          onValueChange={zoomChange}
        />
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
          iconName={willRecord === true ? "camera-outline" : "videocam-outline"}
          onPress={toggleCapture}
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
        <TouchableHighlight onPressIn={willRecord === false ? takePicture: startRecording} onPressOut={willRecord === false ? () => {} : () => camera.current?.stopRecording()}>
                  <FontAwesome5 name="dot-circle" size={80} color={"white"} />
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