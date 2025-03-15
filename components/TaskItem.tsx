import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Button,
  Alert,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { type Task, CATEGORY_ICONS, CATEGORY_COLORS } from "../types";
import * as Speech from "expo-speech";
import { TodoContext } from "@/context/TodoContext";
import { useContext } from "react";
import { router } from "expo-router";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) => {
  const { todos, saveTodos, deleteTodo, editTodo, toggleTodo } =
    useContext(TodoContext);
  const speakTask = (task: any) => {
    Speech.speak(task);
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTodo(id),
      },
    ]);
  };

  return (
    <Animated.View style={styles.container}>
      <View style={{ position: "absolute", top: 5, right: 10 }}>
        <Text style={[styles.timestamp]}>{task.timestamp}</Text>
      </View>
      <TouchableOpacity
        style={styles.taskContainer}
        onPress={() => toggleTodo(task.id)}
        activeOpacity={0.8}
      >
        <View style={styles.checkboxContainer}>
          <View
            style={[
              styles.checkbox,
              task.completed && {
                backgroundColor: CATEGORY_COLORS[task.category],
              },
              { borderColor: CATEGORY_COLORS[task.category] },
            ]}
          >
            {task.completed && <Feather name="check" size={12} color="#FFF" />}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.title, task.completed && styles.completedTitle]}>
            {task.title}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.categoryContainer}>
              <Feather
                name={CATEGORY_ICONS[task.category] as any}
                size={12}
                color={CATEGORY_COLORS[task.category]}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: CATEGORY_COLORS[task.category] },
                ]}
              >
                {task.category}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => speakTask(task.title)}
            style={styles.actionButton}
          >
            <AntDesign name="sound" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/edit_task/${task.id}`)}
            style={styles.actionButton}
          >
            <Feather name="edit-2" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteTask(task.id)}
            style={styles.actionButton}
          >
            <Feather name="trash-2" size={18} color="#FF5757" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  actionsContainer: {
    flexDirection: "row",
    marginLeft: 12,
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
});
