"use client";

import { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { type TaskCategory, CATEGORY_COLORS, CATEGORY_ICONS } from "../types";
import CustomBottomSheet from "./CustomBottomSheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";

interface AddTaskModalProps {
  visible: boolean;
  setVisible: any;
  onClose: () => void;
  onAdd: (title: string, category: TaskCategory) => void;
}

export const AddTaskModal = ({
  visible,
  onAdd,
  setVisible,
}: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<TaskCategory>("Work");
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title, selectedCategory);
      setTitle("");
      handleDismiss();
    }
  };

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    }
  }, [visible]);

  const handleDismiss = () => {
    bottomSheetRef.current?.dismiss();
    setVisible(false);
  };

  const handleChange = (text: any) => {
    setTitle(text);
  };

  return (
    // <View style={styles.modalContent}>
    //   <View style={styles.header}>
    //     <Text style={styles.headerText}>Add New Task</Text>
    //     <TouchableOpacity onPress={onClose} style={styles.closeButton}>
    //       <Feather name="x" size={24} color="#666" />
    //     </TouchableOpacity>
    //   </View>

    //   <TextInput
    //     style={styles.input}
    //     placeholder="What do you need to do?"
    //     value={title}
    //     onChangeText={setTitle}
    //     autoFocus
    //   />

    //   <Text style={styles.sectionTitle}>Category</Text>
    //   <ScrollView
    //     horizontal
    //     showsHorizontalScrollIndicator={false}
    //     style={styles.categoriesContainer}
    //   >
    //     {(Object.keys(CATEGORY_COLORS) as TaskCategory[]).map(
    //       (category) => (
    //         <TouchableOpacity
    //           key={category}
    //           style={[
    //             styles.categoryButton,
    //             selectedCategory === category && styles.selectedCategory,
    //             { borderColor: CATEGORY_COLORS[category] },
    //           ]}
    //           onPress={() => setSelectedCategory(category)}
    //         >
    //           <Feather
    //             name={CATEGORY_ICONS[category] as any}
    //             size={16}
    //             color={
    //               selectedCategory === category
    //                 ? "#FFF"
    //                 : CATEGORY_COLORS[category]
    //             }
    //           />
    //           <Text
    //             style={[
    //               styles.categoryText,
    //               selectedCategory === category &&
    //                 styles.selectedCategoryText,
    //               {
    //                 color:
    //                   selectedCategory === category
    //                     ? "#FFF"
    //                     : CATEGORY_COLORS[category],
    //               },
    //             ]}
    //           >
    //             {category}
    //           </Text>
    //         </TouchableOpacity>
    //       )
    //     )}
    //   </ScrollView>

    //   <TouchableOpacity
    //     style={[
    //       styles.addButton,
    //       { backgroundColor: CATEGORY_COLORS[selectedCategory] },
    //     ]}
    //     onPress={handleAdd}
    //   >
    //     <Text style={styles.addButtonText}>Add Task</Text>
    //   </TouchableOpacity>
    // </View>

    <CustomBottomSheet ref={bottomSheetRef} onDismiss={handleDismiss}>
      <View style={styles.modalContent}>
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>Add New Task</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="What do you need to do?"
          value={title}
          onChangeText={setTitle}
          // autoFocus
        /> */}

        <BottomSheetTextInput
          style={styles.input}
          placeholder="What do you need to do?"
          value={title}
          onChangeText={(text) => handleChange(text)}
        />

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
          onPress={handleAdd}
        >
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </CustomBottomSheet>
  );
};

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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
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
    marginRight: 10,
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
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
