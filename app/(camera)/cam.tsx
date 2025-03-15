import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { router } from "expo-router";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.messageContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.messageContainer}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo: any = await cameraRef.takePictureAsync({ base64: true });
        setIsPreview(true);

        router.push({
          pathname: "/(camera)/scan",
          params: { photoUri: photo.uri },
        });

        setIsPreview(false);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)}>
        {!isPreview && (
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureText}>Scan</Text>
          </TouchableOpacity>
        )}
      </CameraView>
      {isPreview && (
        <View style={styles.previewText}>
          <Text style={{ color: "#fff" }}>Processing...</Text>
        </View>
      )}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  captureButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "red",
    padding: 15,
    borderRadius: 30,
  },
  captureText: {
    color: "#fff",
    fontSize: 16,
  },
  previewText: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
