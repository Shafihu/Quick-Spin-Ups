import { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import type { Task, TaskCategory } from "../../types";
import { TaskItem } from "@/components/TaskItem";
import { AddTaskModal } from "@/components/AddTaskModal";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { TodoContext } from "@/context/TodoContext";
import AnimateLottie from "@/components/AnimateLottie";
import LottieView from "lottie-react-native";
import FloatingActionButton from "@/components/FloatingButton";
import Header from "@/components/Header";
import { Audio } from "expo-av";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { todos, saveTodos } = useContext(TodoContext);
  const [sound, setSound] = useState<any>(null);

  // console.log(todos);

  const handleAddTask = (title: string, category: TaskCategory) => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      category,
      completed: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      color: "",
    };

    setTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTasks(tasks.filter((task) => task.id !== id));
        },
      },
    ]);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddModalVisible(true);
  };

  const playSound = async (soundFile: any) => {
    if (sound) {
      await sound.unloadAsync(); // Unload previous sound to prevent overlap
    }
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LottieView
          source={require("../../assets/animations/empty.json")}
          style={{ width: 200, height: 200 }}
          autoPlay={true}
          loop={true}
        />

        <Text style={styles.emptyTitle}>No tasks yet</Text>
        <Text style={styles.emptySubtitle}>
          Stay organized by adding new tasks. Tap the "+" button to get started.
        </Text>

        <Text style={styles.hintText}>
          Once you add a task, you can tap on it to mark it as completed.
        </Text>

        <FloatingActionButton onPress={() => router.push(`/add_task/`)} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />

        <View style={styles.header}>
          <Text style={styles.historyHeader}>Today's tasks</Text>
        </View>

        <View style={styles.tasksList}>
          {todos.length > 0 &&
            todos.map((task: any) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => handleToggleTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
                onEdit={() => handleEditTask(task)}
              />
            ))}
        </View>

        {isAddModalVisible && (
          <AddTaskModal
            visible={isAddModalVisible}
            onClose={() => {
              setIsAddModalVisible(false);
              setEditingTask(null);
            }}
            onAdd={handleAddTask}
            setVisible={setIsAddModalVisible}
          />
        )}
      </ScrollView>
      <FloatingActionButton onPress={() => router.push(`/add_task/`)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    paddingBottom: 0,
    paddingTop: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    margin: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  voiceButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  voiceButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  icon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  hintText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
});
