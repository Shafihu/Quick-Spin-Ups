import React from "react";
import { TouchableOpacity, Animated, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const FloatingActionButton = ({ onPress }: { onPress: any }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <LinearGradient
            colors={["#FF6B6B", "#FF4949"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
            </View>
          </LinearGradient>
          {/* Inner shadow effect */}
          <View style={styles.innerShadow} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 999,
  },
  buttonContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    overflow: "hidden",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32.5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});

export default FloatingActionButton;
