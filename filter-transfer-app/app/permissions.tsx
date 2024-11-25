import * as React from 'react';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera'
import * as ExpoMediaLibrary from 'expo-media-library';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from 'react-native';


export default function PermissionsS(){
    const [permissionStatus, setPermissionStatus] = 
        React.useState<CameraPermissionStatus>("not-determined");
    const [micPermissionStatus, setMicPermissionStatus] = 
        React.useState<CameraPermissionStatus>("not-determined");
    const [mediaLibraryPermissions, requestMediaLibraryPermissions] =
        ExpoMediaLibrary.usePermissions();
    
    return(
        <>
           <ThemedView style={styles.container}>
            <ThemedText type="subtitle" style={styles.subtitle}>
                CinemaShots requires access to your camera and media library to work properly.
            </ThemedText>    
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
        textAlign: 'center',
    }
});