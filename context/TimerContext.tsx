import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the Timer type
export type Timer = {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  status: "running" | "paused" | "completed";
};

// Define actions for managing timers
type TimerAction =
  | { type: "ADD_TIMER"; payload: Timer }
  | { type: "START_TIMER"; id: string }
  | { type: "PAUSE_TIMER"; id: string }
  | { type: "RESET_TIMER"; id: string }
  | { type: "UPDATE_TIME"; id: string; timeLeft: number }
  | { type: "DELETE_TIMER"; id: string }
  | { type: "START_ALL_TIMERS" }
  | { type: "PAUSE_ALL_TIMERS" }
  | { type: "RESET_ALL_TIMERS" }
  | { type: "START_CATEGORY_TIMERS"; category: string }
  | { type: "PAUSE_CATEGORY_TIMERS"; category: string }
  | { type: "COMPLETE_TIMER"; id: string }
  | { type: "LOAD_TIMERS"; payload: Timer[] }; // New action type for loading timers

// Define the TimerContext state type
type TimerState = {
  timers: Timer[];
  dispatch: React.Dispatch<TimerAction>;
};

// Create Context with default values
const TimerContext = createContext<TimerState | undefined>(undefined);

// Reducer function for managing timers
const timerReducer = (
  state: TimerState["timers"],
  action: TimerAction
): Timer[] => {
  switch (action.type) {
    case "ADD_TIMER":
      return [...state, action.payload];

    case "START_TIMER":
      return state.map((timer) =>
        timer.id === action.id ? { ...timer, status: "running" } : timer
      );

    case "PAUSE_TIMER":
      return state.map((timer) =>
        timer.id === action.id ? { ...timer, status: "paused" } : timer
      );

    case "RESET_TIMER":
      return state.map((timer) =>
        timer.id === action.id
          ? { ...timer, remainingTime: timer.duration, status: "paused" }
          : timer
      );

    case "UPDATE_TIME":
      return state.map((timer) =>
        timer.id === action.id
          ? { ...timer, remainingTime: action.timeLeft }
          : timer
      );

    case "DELETE_TIMER":
      return state.filter((timer) => timer.id !== action.id);

    case "START_ALL_TIMERS":
      return state.map((timer) =>
        timer.status === "paused" ? { ...timer, status: "running" } : timer
      );

    case "PAUSE_ALL_TIMERS":
      return state.map((timer) =>
        timer.status === "running" ? { ...timer, status: "paused" } : timer
      );

    case "RESET_ALL_TIMERS":
      return state.map((timer) =>
        timer.status === "paused"
          ? { ...timer, status: "paused", remainingTime: timer.duration }
          : timer
      );

    case "START_CATEGORY_TIMERS":
      return state.map((timer) =>
        timer.category === action.category && timer.status === "paused"
          ? { ...timer, status: "running" }
          : timer
      );

    case "PAUSE_CATEGORY_TIMERS":
      return state.map((timer) =>
        timer.category === action.category && timer.status === "running"
          ? { ...timer, status: "paused" }
          : timer
      );

    case "COMPLETE_TIMER":
      return state.map((timer) =>
        timer.id === action.id ? { ...timer, status: "completed" } : timer
      );

    case "LOAD_TIMERS":
      return action.payload; // Replace the entire state with loaded timers

    default:
      return state;
  }
};

// Timer Provider component
export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(timerReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load timers from AsyncStorage when component mounts
  useEffect(() => {
    const loadTimers = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem("timers");
        if (storedTimers) {
          const parsedTimers = JSON.parse(storedTimers);
          // Use the new LOAD_TIMERS action to replace the state
          dispatch({
            type: "LOAD_TIMERS",
            payload: parsedTimers,
          });
        }
      } catch (error) {
        console.error("Failed to load timers from storage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTimers();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save timers to AsyncStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      const saveTimers = async () => {
        try {
          await AsyncStorage.setItem("timers", JSON.stringify(state));
        } catch (error) {
          console.error("Failed to save timers to storage:", error);
        }
      };
      saveTimers();
    }
  }, [state, isLoaded]);

  // Update running timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      state.forEach((timer) => {
        if (timer.status === "running" && timer.remainingTime > 0) {
          dispatch({
            type: "UPDATE_TIME",
            id: timer.id,
            timeLeft: Math.max(timer.remainingTime - 1, 0),
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, dispatch]);

  return (
    <TimerContext.Provider value={{ timers: state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom Hook to use TimerContext
export const useTimers = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimers must be used within a TimerProvider");
  }
  return context;
};
