import React from "react";
import { router, Stack } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ViewRequestLayout() {
  const theme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
          headerTitle: "Request Details",
          // headerLeft: () => (
          //   <TouchableOpacity onPress={() => router.back()}>
          //     <Ionicons
          //       name="chevron-back"
          //       size={24}
          //       color={theme === "light" ? "#333" : "#fff"}
          //     />
          //   </TouchableOpacity>
          // ),
        }}
      />
    </Stack>
  );
}
