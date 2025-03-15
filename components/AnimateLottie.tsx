import React from "react";
import LottieView from "lottie-react-native";

export default function AnimateLottie({ src }: { src: any }) {
  return (
    <LottieView
      source={src}
      style={{ width: 200, height: 200, zIndex: 100000000 }}
      autoPlay={true}
      loop={true}
    />
  );
}
