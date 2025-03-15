import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Stay Productive & Focused",
    description:
      "Create tasks, track progress, and achieve your daily goals effortlessly.",
    image:
      "https://api.a0.dev/assets/image?text=beautiful+modern+phone+mockup+showing+task+management+clean+minimal+design&aspect=9:16&seed=1",
  },
  {
    id: "2",
    title: "Track Your Mood & Stay Balanced",
    description:
      "Log your emotions, reflect on your well-being, and get personalized suggestions.",
    image:
      "https://api.a0.dev/assets/image?text=beautiful+modern+phone+mockup+showing+mood+tracker+clean+minimal+design&aspect=9:16&seed=2",
  },
  {
    id: "3",
    title: "Get Inspired Every Day",
    description:
      "Discover daily motivational quotes to uplift and inspire your journey.",
    image:
      "https://api.a0.dev/assets/image?text=beautiful+modern+phone+mockup+showing+motivational+quotes+clean+minimal+design&aspect=9:16&seed=3",
  },
];

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<any>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      console.log("Last slide - Get Started!");
      router.replace("/(tabs)/test");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <View style={styles.slide}>
<Image
  source={require('../../assets/images/mockup.png')} // ✅ Correct for local images
  style={styles.image}
  resizeMode="contain"
/>

              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 16, 8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                style={[styles.dot, { width: dotWidth, opacity }]}
                key={index.toString()}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={scrollTo}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#FF6B6B", "#FF4949"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: "center",
  },
  image: {
    flex: 0.7,
    width: width * 0.8,
    marginTop: 50
  },
  textContainer: {
    flex: 0.3,
    alignItems: "center",
    paddingTop: 50
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontWeight: "300",
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 64,
    fontSize: 16,
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  pagination: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
    marginHorizontal: 4,
  },
  button: {
    marginTop: 15,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Onboarding;
