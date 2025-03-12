import { StyleProp, StyleSheet, Text, ViewProps } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import StyledText from "./StyledText";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onPress: () => void;
  icon?:
    | "play"
    | "pause"
    | "stop"
    | "repeat"
    | "reload"
    | "add"
    | "remove"
    | "time"
    | "sunny"
    | "moon-sharp"
    | "trash";
  title?: string;
  style?: any;
};

const ActionButton = ({ onPress, icon = "play", title = "", style }: Props) => {
  const theme = useTheme().theme;
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Ionicons
        name={icon}
        size={30}
        color={theme === "dark" ? "white" : "black"}
      />
      <StyledText>{title}</StyledText>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
