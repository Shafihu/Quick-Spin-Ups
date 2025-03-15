import { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { type TaskCategory, CATEGORY_COLORS, CATEGORY_ICONS, Task } from "../../types";
import { TodoContext } from "@/context/TodoContext";
import { router } from "expo-router";

const AddTaskModal = ({ visible, onAdd, setVisible }: any) => {
  const [title, setTitle] = useState("");
  const { todos, saveTodos } = useContext(TodoContext);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>("Work");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ⬅️ Error state

  const handleAddTask = () => {
    if (!title.trim()) {
      setError("Task title cannot be empty!"); // ⬅️ Set error message
      return;
    }
    if (loading) return;

    setError(""); // ⬅️ Clear error when valid input is provided
    setLoading(true);

    setTimeout(() => {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        category: selectedCategory,
        completed: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        color: "",
      };

      saveTodos([newTask, ...todos]);
      setTitle("");
      setLoading(false);
      router.back();
    }, 3000);
  };

  return (
    <View style={{ flex: 1, paddingVertical: 16, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add New Task</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What do you need to do?"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (error) setError(""); 
        }}
        autoFocus
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
        style={[styles.addButton, { backgroundColor: CATEGORY_COLORS[selectedCategory] }]}
        onPress={handleAddTask}
        disabled={loading}
      >
        {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.addButtonText}>Add Task</Text>}
      </TouchableOpacity>
</View>
    </View>
  );
};

export default AddTaskModal;

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
  errorText: {
    color: "#F00",
    marginBottom: 10,
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  }
});
