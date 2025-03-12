import { ThemeProvider } from "@/context/ThemeContext";
import { TimerProvider } from "@/context/TimerContext";
import { Slot, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TimerProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Timer" }} />

          <Stack.Screen
            name="history"
            options={{ title: "History", animation: "slide_from_left" }}
          />
          <Stack.Screen name="timers/new" options={{ title: "Add Timer" }} />
        </Stack>
      </TimerProvider>
    </ThemeProvider>
  );
}
