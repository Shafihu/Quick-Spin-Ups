import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const MoodHistoryManager = () => {
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [moodHistory, setMoodHistory] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [moodReason, setMoodReason] = useState("");

  const [scaleAnim] = useState(new Animated.Value(0));
  const [chartAnim] = useState(new Animated.Value(0));

  const moods = [
    {
      id: 1,
      emoji: "😊",
      name: "Happy",
      color: ["#FFD93D", "#FF8E3C"],
      tasks: [
        "Go for a walk in nature",
        "Call a friend",
        "Start a gratitude journal",
      ],
    },
    {
      id: 2,
      emoji: "😢",
      name: "Sad",
      color: ["#89CFF0", "#6495ED"],
      tasks: [
        "Practice deep breathing",
        "Listen to uplifting music",
        "Write down your feelings",
      ],
    },
    {
      id: 3,
      emoji: "😠",
      name: "Angry",
      color: ["#FF6B6B", "#FF4949"],
      tasks: [
        "Do physical exercise",
        "Practice meditation",
        "Count to ten slowly",
      ],
    },
    {
      id: 4,
      emoji: "😴",
      name: "Tired",
      color: ["#A7BBC7", "#8FA5B3"],
      tasks: [
        "Take a power nap",
        "Have a healthy snack",
        "Do light stretching",
      ],
    },
    {
      id: 5,
      emoji: "🤔",
      name: "Anxious",
      color: ["#9FA8DA", "#7986CB"],
      tasks: [
        "Practice mindfulness",
        "Make a to-do list",
        "Take a relaxing bath",
      ],
    },
  ];

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    const storedHistory = await AsyncStorage.getItem("moodHistory");
    if (storedHistory) {
      setMoodHistory(JSON.parse(storedHistory));
    }
  };

  const saveMoodWithReason = async () => {
    if (!selectedMood) return;

    const now = new Date();
    const formattedTime = format(now, "do MMM, yyyy 'at' hh:mm a");

    const newEntry = {
      mood: selectedMood.name,
      emoji: selectedMood.emoji,
      time: formattedTime,
      reason: moodReason, // Save the reason
    };

    const updatedHistory = [newEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    await AsyncStorage.setItem("moodHistory", JSON.stringify(updatedHistory));

    // Reset state and close modal
    setMoodReason("");
    setIsModalVisible(false);

    // Animate Chart to show
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(chartAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getMoodStats = () => {
    const stats = moods.reduce((acc, mood) => {
      acc[mood.name] = moodHistory.filter(
        (h: any) => h.mood === mood.name
      ).length;
      return acc;
    }, {});
    const total =
      Object.values(stats).reduce((a: any, b: any) => a + b, 0) || 1;
    return moods.map((mood) => ({
      ...mood,
      percentage: ((stats[mood.name] || 0) / total) * 100,
    }));
  };

  const saveMood = async (mood: any) => {
    const now = new Date();
    const formattedTime = format(now, "do MMM, yyyy 'at' hh:mm a"); // Example: "22nd Feb, 2025 at 10:45 AM"

    const newEntry = {
      mood: mood.name,
      emoji: mood.emoji,
      time: formattedTime,
    };

    const updatedHistory = [newEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    await AsyncStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
  };

  const handleMoodSelect = (mood: any) => {
    setSelectedMood(mood);
    setIsModalVisible(true);
    // saveMood(mood);
    // Animated.parallel([
    //   Animated.spring(scaleAnim, {
    //     toValue: 1,
    //     friction: 8,
    //     tension: 40,
    //     useNativeDriver: true,
    //   }),
    //   Animated.timing(chartAnim, {
    //     toValue: 1,
    //     duration: 1000,
    //     useNativeDriver: true,
    //   }),
    // ]).start();
  };

  const renderMoodStats = () => {
    const stats = getMoodStats();
    return (
      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: chartAnim,
            transform: [
              {
                translateY: chartAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={styles.statPercentage}>
                {Math.round(stat.percentage)}%
              </Text>
            </View>
            <LinearGradient
              colors={stat.color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.statBar, { width: `${stat.percentage}%` }]}
            />
          </View>
        ))}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={["#f6f7f9", "#ffffff"]}
          style={styles.background}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Mood Tracker</Text>
            <Text style={styles.subHeader}>How are you feeling today?</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodContainer}
          >
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => handleMoodSelect(mood)}
                style={[
                  styles.moodItem,
                  selectedMood?.id === mood.id && styles.selectedMoodItem,
                ]}
              >
                <LinearGradient
                  colors={mood.color}
                  style={styles.moodGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodName}>{mood.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedMood && (
            <Animated.View
              style={[
                styles.selectedMoodContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <LinearGradient
                colors={selectedMood.color}
                style={styles.selectedMoodGradient}
              >
                <Text style={styles.selectedMoodText}>
                  You're feeling {selectedMood.name.toLowerCase()} today
                </Text>
              </LinearGradient>
            </Animated.View>
          )}

          {selectedMood && (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/suggested_tasks/suggestions",
                  params: { tasks: JSON.stringify(selectedMood.tasks) },
                })
              }
              style={{
                paddingHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 16 }}>See suggested tasks</Text>
              <Ionicons name="arrow-forward-outline" size={24} />
            </TouchableOpacity>
          )}

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Your Mood Distribution</Text>
            {renderMoodStats()}
          </View>

          <View style={styles.historySection}>
            <Text style={styles.historyHeader}>Recent Moods</Text>
            <ScrollView style={styles.historyContainer}>
              {moodHistory.slice(0, 5).map((entry: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    router.push({
                      pathname: "/mood_details/details",
                      params: {
                        mood: entry.mood,
                        reason: entry.reason,
                        timestamp: entry.time,
                      },
                    })
                  }
                >
                  <LinearGradient
                    colors={["#ffffff", "#f8f9fa"]}
                    style={styles.historyItem}
                  >
                    <Text style={styles.historyEmoji}>{entry.emoji}</Text>
                    <View style={styles.historyTextContainer}>
                      <Text style={styles.historyMood}>{entry.mood}</Text>
                      <Text style={styles.historyTime}>{entry.time}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#ccc"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>
      </ScrollView>
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Why do you feel {selectedMood.name.toLowerCase()}?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your reason..."
              value={moodReason}
              onChangeText={setMoodReason}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveMoodWithReason}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    // flex: 1,
    // paddingTop: 60,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  moodContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  moodItem: {
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedMoodItem: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  moodGradient: {
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
    width: 100,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodName: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  selectedMoodContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  selectedMoodGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  selectedMoodText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  chartSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  statsContainer: {
    marginTop: 10,
  },
  statItem: {
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statEmoji: {
    fontSize: 16,
  },
  statPercentage: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statBar: {
    height: 8,
    borderRadius: 4,
    minWidth: 20,
  },
  historySection: {
    flex: 1,
    padding: 20,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  historyContainer: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  historyTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default MoodHistoryManager;
