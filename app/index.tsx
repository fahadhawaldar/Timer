import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useTimers } from "../context/TimerContext";
import { useRouter, useNavigation } from "expo-router";

import ActionButton from "@/src/components/ActionButton";
import CounterItem from "@/src/components/CounterItem";

import StyledView from "@/src/components/StyledView";
import { useTheme } from "@/context/ThemeContext";
import StyledText from "@/src/components/StyledText";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function HomeScreen() {
  const { timers, dispatch } = useTimers();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const navigation: NativeStackNavigationProp<any> = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories =
    Array.from(
      new Set(
        timers.map((timer) =>
          timer.category && timer.status !== "completed" ? timer.category : ""
        )
      )
    ).filter(Boolean) || [];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ActionButton
            icon="add"
            // title="Add Timer"
            onPress={() => router.push("/timers/new")}
          />
        </View>
      ),
      headerLeft: () => (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ActionButton
            icon="time"
            // title="History"
            onPress={() => router.push("/history")}
          />
          <ActionButton
            icon={theme === "dark" ? "sunny" : "moon-sharp"}
            // title="History"
            onPress={toggleTheme}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: theme === "dark" ? "#252525" : "#f9f9f9",
      },
      headerTintColor: theme === "dark" ? "#f9f9f9" : "#252525",
    });
  }, [navigation, theme]);

  if (categories.length === 0) {
    return (
      <StyledView style={{ flex: 1, padding: 20 }}>
        <StyledText style={{ fontSize: 24, textAlign: "center" }}>
          You don't have any timers yet. Press the + button at the top right to
          add a new timer.
        </StyledText>
        <ActionButton
          style={{ alignSelf: "center", marginTop: 40 }}
          icon="add"
          title="Add Timer"
          onPress={() => router.push("/timers/new")}
        />
      </StyledView>
    );
  }

  return (
    <StyledView style={{ flex: 1, padding: 20, gap: 12 }}>
      <View style={styles.actions}>
        {/* Bulk Action Buttons */}
        <ActionButton
          title="Start All"
          onPress={() => dispatch({ type: "START_ALL_TIMERS" })}
        />
        <ActionButton
          icon="pause"
          title="Pause All"
          onPress={() => dispatch({ type: "PAUSE_ALL_TIMERS" })}
        />
        <ActionButton
          icon="reload"
          title="Reset All"
          onPress={() => dispatch({ type: "RESET_ALL_TIMERS" })}
        />
      </View>

      {/* Timers grouped by category */}

      {categories.map((category, i) => {
        const isPaused = timers
          .filter(
            (timer) =>
              timer.category === category && timer.status !== "completed"
          )
          .every((timer) => timer.status === "paused");

        return (
          <View key={category}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(category)}
              style={styles.catContainer}
            >
              <StyledText style={{ fontWeight: "bold", fontSize: 18 }}>
                {category}
              </StyledText>

              {/* Category-level Bulk Actions */}
              <ActionButton
                icon={!isPaused ? "pause" : "play"}
                onPress={() => {
                  console.log(isPaused, " uuuu");

                  if (isPaused) {
                    dispatch({ type: "START_CATEGORY_TIMERS", category });
                  } else {
                    dispatch({ type: "PAUSE_CATEGORY_TIMERS", category });
                  }
                }}
              />
            </TouchableOpacity>

            {selectedCategory === category ? (
              <FlatList
                data={timers.filter(
                  (timer) =>
                    timer.category === category && timer.status !== "completed"
                )}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CounterItem dispatch={dispatch} timer={item} />
                )}
              />
            ) : null}
          </View>
        );
      })}
    </StyledView>
  );
}
export const styles = StyleSheet.create({
  timerContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timerText: {
    marginRight: 10,
  },
  actions: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  catContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
});
