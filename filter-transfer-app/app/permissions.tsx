import * as React from 'react';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera'
import * as ExpoMediaLibrary from 'expo-media-library';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, Switch, TouchableOpacity, View, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const ICON_SIZE = 32;

export default function Permissions(){
    const router = useRouter();
    const [permissionStatus, setPermissionStatus] = 
        React.useState<CameraPermissionStatus>("not-determined");
    const [micPermissionStatus, setMicPermissionStatus] = 
        React.useState<CameraPermissionStatus>("not-determined");
    const [mediaLibraryPermissions, requestMediaLibraryPermissions] =
        ExpoMediaLibrary.usePermissions();

    const requestCameraPermission = async () => {
        const permissions = await Camera.requestCameraPermission();
        setPermissionStatus(status);
    }

    const requestMicrophonePermission = async () => {
        const permissions = await Camera.requestMicrophonePermission();
        setMicPermissionStatus(status);
    }

    const handleContinue = () => {
        if(permissionStatus === "granted" && micPermissionStatus === "granted" && mediaLibraryPermissions?.granted){
            router.replace("/");
        }else{
            Alert.alert("Please enable all permissions to continue.");
        }
    }

    const PermissionsContent = () => (
        <ThemedView style={styles.container}>
            <ThemedText type="subtitle" style={styles.subtitle}>
                CinemaShots requires access to your camera and media library to work properly.
            </ThemedText>    
        </ThemedView>
    );
    
    return(
        <>
        <Stack.Screen options={{headerTitle: "Permissions"}}/>
           <ThemedView style={styles.container}>
            <View style={styles.spacer}/>
            <ThemedText type="subtitle" style={styles.subtitle}>
                CinemaShots requires access to your camera and media library to work properly.
            </ThemedText>
            <View style={styles.spacer}/>
            <View style={styles.row}>
                <Ionicons name="lock-closed-outline" size={ICON_SIZE} color="blue"/>
                <ThemedText style={styles.footnote}>
                    Required Permissions
                </ThemedText>
            </View>
            <View style={styles.spacer}/>
            <View style={StyleSheet.compose(styles.row, styles.permissionContainer)}>
                <Ionicons name="camera-outline" size={ICON_SIZE} color="blue"/>
                <View style={styles.permissionText}>
                    <ThemedText type="subtitle">Camera</ThemedText>
                    <ThemedText>This permission must be enabled to take videos and photos.</ThemedText>
                </View>
                <Switch trackColor={{true: "blue"}}
                    value={micPermissionStatus === "granted"}
                    onChange={requestCameraPermission}
                />
            </View>
            <View style={styles.spacer}/>
            <View style={StyleSheet.compose(styles.row, styles.permissionContainer)}>
                <Ionicons name="mic-outline" size={ICON_SIZE} color="blue"/>
                <View style={styles.permissionText}>
                    <ThemedText type="subtitle">Microphone</ThemedText>
                    <ThemedText>This permission must be enabled to capture audio for videos.</ThemedText>
                </View>
                <Switch trackColor={{true: "blue"}}
                    value={mediaLibraryPermissions?.granted}
                    onChange={requestMicrophonePermission}
                />
            </View>
            <View style={styles.spacer}/>
            <View style={StyleSheet.compose(styles.row, styles.permissionContainer)}>
                <Ionicons name="camera-outline" size={ICON_SIZE} color="blue"/>
                <View style={styles.permissionText}>
                    <ThemedText type="subtitle">Photo Library</ThemedText>
                    <ThemedText>This permission must be enabled for filters and accessing photos and videos.</ThemedText>
                </View>
                <Switch trackColor={{true: "blue"}}
                    value={permissionStatus === "granted"}
                    onChange={async() => await requestMediaLibraryPermissions()}
                />
            </View>
            <View style={styles.spacer}/>
            <View style={styles.spacer}/>
            <View style={styles.spacer}/>
            <TouchableOpacity style={StyleSheet.compose(styles.row, styles.continueButton)}
                onPress={handleContinue}>
                <Ionicons name="arrow-forward-outline" size={ICON_SIZE} color="black"/>
                <ThemedText>Continue</ThemedText>
            </TouchableOpacity>
           </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    subtitle: {
      textAlign: "center",
    },
    footnote: {
      fontSize: 12,
      fontWeight: "bold",
      letterSpacing: 2,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    spacer: {
      marginVertical: 8,
    },
    permissionContainer: {
      backgroundColor: "#fffff0",
      borderRadius: 10,
      padding: 10,
      justifyContent: "space-between",
    },
    permissionText: {
      marginLeft: 10,
      flexShrink: 1,
    },
    continueButton: {
      padding: 10,
      borderWidth: 2,
      borderColor: "black",
      borderRadius: 50,
      alignSelf: "center",
    },
  });