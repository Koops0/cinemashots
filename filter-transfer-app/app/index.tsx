import {ThemedText} from "@/components/ThemedText";
import { Redirect, useRouter } from "expo-router";
import {Camera, useCameraDevice, useCameraPermission} from 'react-native-vision-camera';
export default function HomeScreen(){
    const {hasPermission} = useCameraPermission();
    const micPermission = Camera.getMicrophonePermissionStatus();
    const redirectPerms = !hasPermission || micPermission === "not-determined";
    const dev = useCameraDevice('back');
    const router = useRouter();

    if(redirectPerms) return <Redirect href={"./permissions"}/>;
    if(!dev) return <></>;

    return (
        <ThemedText>
        Hello World!
        </ThemedText>
    )
}