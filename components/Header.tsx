"use client";

import type React from "react";
import { useEffect, useState, useRef, useContext, useCallback } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TodoContext } from "@/context/TodoContext";
import LottieView from "lottie-react-native";

const Header: React.FC = () => {
  const [greeting, setGreeting] = useState<string>("");
  const { todos } = useContext(TodoContext);
  const animationRef = useRef<LottieView>(null);

  const totalTasks = todos.length;
  const completedTasks = todos.filter((todo: any) => todo.completed).length;
  const progressValue = totalTasks > 0 ? completedTasks / totalTasks : 0;

  const progressAnim = useRef(new Animated.Value(progressValue)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const updateGreeting = useCallback(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    );
  }, []);

  useEffect(() => {
    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(intervalId);
  }, [updateGreeting, fadeAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressValue, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Image
            source={{
              uri: "https://api.a0.dev/assets/image?text=professional%20headshot%20portrait%20minimal%20style&aspect=1:1",
            }}
            style={styles.profileImage}
          />
        </View>

        <LinearGradient
          colors={["#374151", "#1F2937"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {progressValue === 1 && (
            <LottieView
              source={require("../assets/animations/confetti_2.json")}
              style={{
                width: 200,
                height: 200,
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
              }}
              autoPlay={true}
              loop={true}
            />
          )}

          <Text style={styles.cardTitle}>Daily Tasks</Text>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressText}>
              {(progressValue * 100).toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <Animated.View
              style={[styles.progressBar, { width: progressWidth }]}
            />
          </View>

          <Text style={styles.taskCount}>
            {completedTasks} out of {totalTasks} done
          </Text>
        </LinearGradient>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1F2937",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2DD4BF",
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
  },
  progressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF6B6B",
    borderRadius: 3,
  },
  taskCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  confettiContainer: {
    flex: 1,
    height: "100%",
    position: "absolute",
    // top: 0,
    left: 0,
    right: 0,
    bottom: -25,
    zIndex: 1000,
  },
  confettiAnimation: {
    width: "100%",
    height: "100%",
  },
});

export default Header;
