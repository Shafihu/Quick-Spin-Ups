import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

const MoodDetailScreen = () => {
  const { mood, reason, timestamp } = useLocalSearchParams();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  console.log("Mood:", mood);

  const moodEmoji: any = {
    Happy: {
      emoji: "😊",
      colors: ["#FFD93D", "#FF8E3C"],
      icon: "emoticon-happy",
    },
    Sad: { emoji: "😢", colors: ["#89CFF0", "#6495ED"], icon: "emoticon-sad" },
    Angry: {
      emoji: "😠",
      colors: ["#FF6B6B", "#FF4949"],
      icon: "emoticon-angry",
    },
    Tired: {
      emoji: "😴",
      colors: ["#A7BBC7", "#8FA5B3"],
      icon: "emoticon-sleepy",
    },
    Anxious: {
      emoji: "🤔",
      colors: ["#9FA8DA", "#7986CB"],
      icon: "emoticon-confused",
    },
  };

  const suggestions: any = {
    Happy: [
      "Share your joy with others",
      "Start a creative project",
      "Plan something exciting",
    ],
    Sad: [
      "Take a relaxing walk",
      "Talk to a friend",
      "Listen to uplifting music",
    ],
    Angry: [
      "Practice deep breathing",
      "Write down your thoughts",
      "Exercise to release tension",
    ],
    Tired: ["Take a power nap", "Have a healthy snack", "Do light stretching"],
    Anxious: [
      "Practice mindfulness",
      "Write down your worries",
      "Do grounding exercises",
    ],
  };

  // Ensure mood is valid, else use a default
  const selectedMood = moodEmoji[mood] ? mood : "Happy";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={moodEmoji[selectedMood].colors}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.emojiContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.emoji}>{moodEmoji[selectedMood].emoji}</Text>
          <Text style={styles.moodText}>{selectedMood}</Text>
        </Animated.View>
      </LinearGradient>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.timeContainer}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
          <Text style={styles.timestamp}>
            {timestamp || "No timestamp provided"}
          </Text>
        </View>

        <View style={styles.reasonContainer}>
          <Text style={styles.sectionTitle}>Your Thoughts</Text>
          <LinearGradient
            colors={["#ffffff", "#f8f9fa"]}
            style={styles.reasonCard}
          >
            <MaterialCommunityIcons
              name="format-quote-open"
              size={24}
              color={moodEmoji[selectedMood].colors[0]}
              style={styles.quoteIcon}
            />
            <Text style={styles.reasonText}>
              {reason || "No reason provided"}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.suggestionsContainer}>
          <Text style={styles.sectionTitle}>Suggested Activities</Text>
          {suggestions[selectedMood]?.map(
            (suggestion: string, index: number) => (
              <Animated.View
                key={index}
                style={[
                  styles.suggestionCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 50 * (index + 1)],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity style={styles.suggestionButton}>
                  <LinearGradient
                    colors={["#ffffff", "#f8f9fa"]}
                    style={styles.suggestionGradient}
                  >
                    <MaterialCommunityIcons
                      name="star-outline"
                      size={24}
                      color={moodEmoji[selectedMood].colors[0]}
                    />
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  emojiContainer: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  moodText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  contentContainer: {
    padding: 20,
    marginTop: -30,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timestamp: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  reasonContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 15,
  },
  reasonCard: {
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteIcon: {
    marginBottom: 10,
  },
  reasonText: {
    fontSize: 18,
    lineHeight: 26,
    color: "#2d3436",
    fontWeight: "500",
  },
  suggestionsContainer: {
    marginTop: 10,
  },
  suggestionCard: {
    marginBottom: 12,
  },
  suggestionButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#2d3436",
    flex: 1,
    fontWeight: "500",
  },
});

export default MoodDetailScreen;
