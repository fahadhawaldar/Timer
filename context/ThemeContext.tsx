// ThemeContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context with default values
const ThemeContext = createContext({
  theme: "light",
  isLoading: true,
  toggleTheme: () => {},
  setTheme: (theme: string) => {},
  isDark: false,
  isLight: true,
});

// Custom hook for easy context usage
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with a loading state and default theme
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme !== null) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme to AsyncStorage when it changes
  const persistTheme = async (newTheme: string) => {
    try {
      await AsyncStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme to AsyncStorage:", error);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    persistTheme(newTheme);
  };

  // Set a specific theme
  const setSpecificTheme = (newTheme: string) => {
    persistTheme(newTheme);
  };

  // Values to be provided to consumers
  const value = {
    theme,
    isLoading,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };

  return (
    <ThemeContext.Provider value={value}>
      {!isLoading ? children : null}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
