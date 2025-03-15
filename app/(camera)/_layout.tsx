import { Stack } from "expo-router";

export default function CameraLayout() {
  return (
    <Stack>
      <Stack.Screen name="take-pic" options={{ headerShown: false }} />
      <Stack.Screen name="process-image" options={{ headerShown: false }} />
      <Stack.Screen name="test" options={{ headerShown: false }} />
      <Stack.Screen name="scan" options={{ headerShown: false }} />
      <Stack.Screen name="cam" options={{ headerShown: false }} />
      <Stack.Screen name="formTest" options={{ headerShown: false }} />
      <Stack.Screen name="contacts" options={{ headerShown: false }} />
      <Stack.Screen name="ai-document" options={{ headerShown: false }} />
    </Stack>
  );
}
