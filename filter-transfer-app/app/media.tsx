import React, { useEffect } from "react";
import { Link,  useLocalSearchParams, useRouter } from "expo-router";
import { Alert, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { saveToLibraryAsync } from "expo-media-library";

export default function MediaScreen() {
    const { media } = useLocalSearchParams();
    const router = useRouter();
  
    useEffect(() => {
      const savePhoto = async () => {
        try {
          await saveToLibraryAsync(media as string);
          Alert.alert("Saved to gallery!");
          router.back();
        } catch (error) {
          Alert.alert("Failed to save photo", error.message);
        }
      };
  
      savePhoto();
    }, [media, router]);
  
    return;
  }