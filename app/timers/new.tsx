import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTimers } from "../../context/TimerContext";
import StyledView from "@/src/components/StyledView";
import StyledText from "@/src/components/StyledText";
import { useTheme } from "@/context/ThemeContext";
import ActionButton from "@/src/components/ActionButton";
export default function NewTimerScreen() {
  const { dispatch } = useTimers();
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme().theme;

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("General");

  const Categories = ["General", "Workout", "Study", "Break"];

  const handleAddTimer = () => {
    if (!name || !duration) return;
    dispatch({
      type: "ADD_TIMER",
      payload: {
        id: Math.random().toString(36),
        name,
        duration: Number(duration),
        remainingTime: Number(duration),
        category: category,
        status: "paused",
      },
    });
    router.back();
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme === "dark" ? "#252525" : "#f9f9f9",
      },
      headerTintColor: theme === "dark" ? "#f9f9f9" : "#252525",
    });
  }, [navigation, theme]);

  return (
    <StyledView style={{ flex: 1, height: "100%" }}>
      <View style={styles.container}>
        <StyledText style={styles.label}>Name</StyledText>
        <TextInput
          style={[
            styles.input,
            { color: theme === "dark" ? "#f9f9f9" : "#252525" },
          ]}
          inputMode="text"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <StyledText style={styles.label}>Duration (seconds)</StyledText>
        <TextInput
          style={[
            styles.input,
            { color: theme === "dark" ? "#f9f9f9" : "#252525" },
          ]}
          inputMode="numeric"
          placeholder="Duration (seconds)"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />
        <StyledText style={styles.label}>Category</StyledText>
        <FlatList
          contentContainerStyle={{ height: 50 }}
          data={Categories}
          horizontal
          renderItem={({ item }) => (
            <Text
              onPress={() => setCategory(item)}
              style={[
                styles.chip,
                { fontWeight: category === item ? "bold" : "normal" },
              ]}
            >
              {item}
            </Text>
          )}
        />
        <ActionButton
          style={styles.button}
          icon="add"
          title="Add Timer"
          onPress={handleAddTimer}
        />
      </View>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,

    // flex: 1,
    flexShrink: 0,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    fontSize: 20,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 10,
  },
  chip: {
    margin: 5,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 20,
  },
  button: {
    marginTop: 10,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
