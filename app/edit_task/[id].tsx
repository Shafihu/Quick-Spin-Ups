"use client";

import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  type TaskCategory,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  Task,
} from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TodoContext } from "@/context/TodoContext";
import { useGlobalSearchParams } from "expo-router";

interface AddTaskModalProps {
  visible: boolean;
  setVisible: any;
  onClose: () => void;
  onAdd: (title: string, category: TaskCategory) => void;
}

const EditTaskModal = ({ visible, onAdd, setVisible }: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const { todos, saveTodos, editTodo } = useContext(TodoContext);
  const [selectedCategory, setSelectedCategory] =
    useState<TaskCategory>("Work");
  const { id } = useGlobalSearchParams();

  // const currentTask: any = todos.filter((t: any) => t.id === id)[0];
  // setTitle(currentTask.title);
  // console.log(currentTask);

  useEffect(() => {
    const currentTask: any = todos.filter((t: any) => t.id === id)[0];
    setTitle(currentTask.title);
    setSelectedCategory(currentTask.category);
  }, []);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  // useEffect(() => {
  //   saveTasks();
  // }, [tasks]);

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

    saveTodos([newTask, ...todos]);
    setTitle("");
  };

  return (
    <View style={{ flex: 1, paddingVertical: 20, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Edit Task</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What do you need to do?"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />
      <View>
        <Text style={styles.sectionTitle}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {(Object.keys(CATEGORY_COLORS) as TaskCategory[]).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
                { borderColor: CATEGORY_COLORS[category] },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Feather
                name={CATEGORY_ICONS[category] as any}
                size={16}
                color={
                  selectedCategory === category
                    ? "#FFF"
                    : CATEGORY_COLORS[category]
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                  {
                    color:
                      selectedCategory === category
                        ? "#FFF"
                        : CATEGORY_COLORS[category],
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: CATEGORY_COLORS[selectedCategory] },
          ]}
          onPress={() => editTodo(id, title, selectedCategory)}
        >
          <Text style={styles.addButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditTaskModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginHorizontal: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 16,
  },
  selectedCategory: {
    backgroundColor: "#666",
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#FFF",
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 16,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
