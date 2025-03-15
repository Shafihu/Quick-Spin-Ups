import { Stack } from "expo-router";

export default function CameraLayout() {
  return (
    <Stack>
      <Stack.Screen name="slides" options={{ headerShown: false }} />
    </Stack>
  );
}
