import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { Timer } from "@/context/TimerContext";
import StyledView from "./StyledView";
import StyledText from "./StyledText";
type Props = {
  timer: Timer;
  dispatch: React.Dispatch<any>;
};

export const formatTime = (timer: Timer, checkDuration?: boolean) => {
  const time = checkDuration ? timer.duration : timer.remainingTime;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const CounterItem = ({ timer, dispatch }: Props) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (timer.status === "paused") return;
    const interval = setInterval(() => {
      setProgress((timer.remainingTime / timer.duration) * 100);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (progress === 50) {
      Alert.alert("Timer Alert", `${timer.name} is halfway there!`);
    }
  }, [progress]);

  useEffect(() => {
    if (progress === 0 && timer.status === "running") {
      Alert.alert("Timer Alert", `${timer.name} is complete!`);
      dispatch({ type: "COMPLETE_TIMER", id: timer.id });
    }
  }, [progress, dispatch, timer.id]);

  const ProgressBar = () => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    );
  };

  return (
    <StyledView style={styles.container}>
      <View style={styles.timerContainer}>
        <StyledText style={styles.timerName}>{timer.name}</StyledText>
        <StyledText style={styles.timerText}>{formatTime(timer)}</StyledText>
        <View style={styles.actions}>
          <ActionButton
            icon={timer.status === "paused" ? "play" : "pause"}
            onPress={() => {
              if (timer.status === "paused") {
                dispatch({ type: "START_TIMER", id: timer.id });
              } else {
                dispatch({ type: "PAUSE_TIMER", id: timer.id });
              }
            }}
          />
          <ActionButton
            icon="reload"
            onPress={() => dispatch({ type: "RESET_TIMER", id: timer.id })}
          />
        </View>
      </View>
      {timer.status === "running" && <ProgressBar />}
    </StyledView>
  );
};

export default CounterItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    // backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timerText: {
    fontSize: 16,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 10,
    backgroundColor: "#D5E5D5",
    overflow: "hidden",
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#4D55CC",
  },
});
