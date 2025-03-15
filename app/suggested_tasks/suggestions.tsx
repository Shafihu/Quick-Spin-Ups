import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");

const Suggestions = () => {
  const { tasks }: any = useLocalSearchParams();
  const parsedTasks = JSON.parse(tasks);
  const [quote, setQuote] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [sound, setSound] = useState<any>(null);

  const playSound = async (soundFile: any) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  const handleTaskCheck = async () => {
    await playSound(require("../../assets/task-complete.mp3")); // Replace with your sound file
  };

  useEffect(() => {
    fetch("https://qapi.vercel.app/api/random")
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.quote);
        setAuthor(data.author);

        // Animate the quote card
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      });
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#f6f7f9", "#ffffff"]} style={styles.background}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Inspiration</Text>
          <Text style={styles.subtitle}>A quote to brighten your day</Text>
        </View>

        <Animated.View
          style={[
            styles.quoteCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#ffffff", "#f8f9fa"]}
            style={styles.cardGradient}
          >
            <MaterialCommunityIcons
              name="format-quote-open"
              size={32}
              color="#6c5ce7"
              style={styles.quoteIcon}
            />

            <Text style={styles.quoteText}>{quote}</Text>

            <View style={styles.authorContainer}>
              <View style={styles.authorLine} />
              <Text style={styles.authorText}> {author}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.tasksContainer}>
          <Text style={styles.tasksTitle}>Suggested Tasks</Text>
          {parsedTasks.map((task: string, index: number) => (
            <TouchableOpacity key={index} onPress={handleTaskCheck}>
              <Animated.View
                style={[
                  styles.taskItem,
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
                <LinearGradient
                  colors={["#ffffff", "#f8f9fa"]}
                  style={styles.taskGradient}
                >
                  <MaterialCommunityIcons
                    name="checkbox-marked-circle-outline"
                    size={24}
                    color="#6c5ce7"
                  />
                  <Text style={styles.taskText}>{task}</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

export default Suggestions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  quoteCard: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 25,
    borderRadius: 20,
  },
  quoteIcon: {
    marginBottom: 15,
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    color: "#2d3436",
    fontWeight: "500",
    marginBottom: 20,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  authorLine: {
    width: 20,
    height: 2,
    backgroundColor: "#6c5ce7",
    marginRight: 10,
  },
  authorText: {
    fontSize: 16,
    color: "#6c5ce7",
    fontWeight: "600",
  },
  tasksContainer: {
    padding: 20,
  },
  tasksTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 15,
  },
  taskItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
  },
  taskText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#2d3436",
    flex: 1,
  },
});
