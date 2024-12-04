import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface ButtonProps {
  onPress: () => void;
  title?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
}
export default function ZoomSliderButton({
  onPress,
  iconName,
  title,
  containerStyle,
  iconSize,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: Colors.light.background,
          borderRadius: 50,
          alignSelf: "flex-start",
        },
        containerStyle,
      ]}
    >
      {iconName && (
        <Ionicons name={iconName} size={iconSize ?? 28} color={"black"} />
      )}
      {title ? (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "black",
          }}
        >
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#ffcccc"
  },
});