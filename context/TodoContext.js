import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  // Load todos from AsyncStorage
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };
    loadTodos();
    // clearTodos();
  }, []);

  // Save todos to AsyncStorage
  const saveTodos = async (newTodos) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  // Clear Todos from AsyncStorage
  const clearTodos = async () => {
    try {
      await AsyncStorage.removeItem("todos");
      setTodos([]);
    } catch (error) {
      console.error("Error clearing todos:", error);
    }
  };

  // Delete a todo from AsyncStorage
  const deleteTodo = async (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(updatedTodos);
  };

  // Edit a todo from AsyncStorage
  const editTodo = async (id, updatedText, selectedCategory) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, title: updatedText, category: selectedCategory }
        : todo
    );
    saveTodos(updatedTodos);
  };

  // Toggle a todo from AsyncStorage
  const toggleTodo = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  return (
    <TodoContext.Provider
      value={{ todos, saveTodos, deleteTodo, editTodo, toggleTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};
