import { Timer, useTimers } from "@/context/TimerContext";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { formatTime } from "@/src/components/CounterItem";
import StyledText from "@/src/components/StyledText";
import StyledView from "@/src/components/StyledView";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigation } from "expo-router";
import ActionButton from "@/src/components/ActionButton";

export default function HistoryScreen() {
  const { timers, dispatch } = useTimers();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const completedTimers = timers.filter(
    (timer) => timer.status === "completed"
  );

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme === "dark" ? "#252525" : "#f9f9f9",
      },
      headerTintColor: theme === "dark" ? "#f9f9f9" : "#252525",
    });
  }, [navigation, theme]);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Timer", "Are you sure you want to delete this timer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch({ type: "DELETE_TIMER", id }),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Timer }) => {
    const textColor = theme === "dark" ? "#f9f9f9" : "#252525";

    return (
      <StyledView style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <StyledText style={[styles.itemName, { color: textColor }]}>
            {item.name}
          </StyledText>

          <View style={styles.detailsRow}>
            <StyledText style={styles.categoryText}>{item.category}</StyledText>

            <StyledText style={[styles.timeText, { color: textColor }]}>
              {formatTime(item, true)}
            </StyledText>
          </View>
        </View>

        <ActionButton
          icon="trash"
          title="Delete"
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        />
      </StyledView>
    );
  };

  return (
    <StyledView style={styles.container}>
      {completedTimers.length === 0 ? (
        <StyledView style={styles.emptyState}>
          <StyledText style={styles.emptyText}>
            No completed timers yet
          </StyledText>
        </StyledView>
      ) : (
        <FlatList
          data={completedTimers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 8,
  },
  timeText: {
    fontSize: 16,
  },
  categoryBadge: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    marginLeft: 12,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
