import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import axios from "axios";

export default function DocumentScanner() {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Verify camera permissions
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const captureDocument = async () => {
    try {
      if (!cameraRef.current) throw new Error("Camera not ready");

      setIsProcessing(true);
      const photo: any = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: true,
        scale: 0.8,
      });

      const processed = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1200 } }, { rotate: 0 }],
        {
          compress: Platform.OS === "ios" ? 0.8 : 0.7,
          format: SaveFormat.JPEG,
        }
      );

      setCapturedImage(processed.uri);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to capture image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOCRProcessing = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: capturedImage,
        type: "image/jpeg",
        name: "document.jpg",
      } as any);

      const response = await fetch("http://172.20.10.4:5000/api/ocr/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();

      console.log(result);
      setCapturedImage(null);
      setError(null);
    } catch (err) {
      setError("Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialCommunityIcons name="camera-off" size={80} color="#6200ee" />
        <Text style={styles.permissionText}>
          Camera access required for document scanning
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing={facing}
          flash={flash}
          mode="picture"
          enableTorch={flash === "on"}
        >
          <View style={styles.overlay}>
            <View style={styles.viewfinder}>
              {/* <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} /> */}
            </View>
            <Text style={styles.scanGuideText}>
              Align document edges with the frame
            </Text>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() =>
                setFlash((current) => (current === "off" ? "on" : "off"))
              }
            >
              <Ionicons
                name={flash === "on" ? "flash" : "flash-off"}
                size={28}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.captureButton,
                isProcessing && styles.disabledButton,
              ]}
              onPress={captureDocument}
              disabled={isProcessing}
            >
              <View style={styles.captureButtonInner}>
                {isProcessing && (
                  <ActivityIndicator size="small" color="#fff" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() =>
                setFacing((current) => (current === "back" ? "front" : "back"))
              }
            >
              <Ionicons name="camera-reverse" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.previewImage}
            resizeMode="contain"
          />

          <View style={styles.previewControls}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => setCapturedImage(null)}
            >
              <FontAwesome name="repeat" size={22} color="white" />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewButton, styles.processButton]}
              onPress={handleOCRProcessing}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialIcons name="text-snippet" size={22} color="white" />
                  <Text style={styles.previewButtonText}>Scan Document</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal visible={!!error} transparent animationType="fade">
        <View style={styles.errorModal}>
          <View style={styles.errorContent}>
            <MaterialIcons name="error-outline" size={44} color="#d32f2f" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => setError(null)}
            >
              <Text style={styles.errorButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 25,
    color: "#444",
    lineHeight: 26,
  },
  permissionButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 28,
    elevation: 3,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  viewfinder: {
    width: "85%",
    height: "65%",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 14,
    backgroundColor: "transparent",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#6200ee",
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanGuideText: {
    color: "white",
    fontSize: 16,
    marginTop: 25,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontWeight: "500",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 35,
  },
  controlButton: {
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 28,
    elevation: 3,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.9)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonIcon: {
    width: 24,
    height: 24,
    backgroundColor: "white",
    borderRadius: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewImage: {
    flex: 1,
    margin: 20,
    borderRadius: 14,
    backgroundColor: "#111",
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 22,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  previewButton: {
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 26,
    backgroundColor: "#333",
    flexDirection: "row",
    gap: 10,
    elevation: 2,
  },
  processButton: {
    backgroundColor: "#6200ee",
  },
  previewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  errorContent: {
    backgroundColor: "white",
    padding: 28,
    borderRadius: 18,
    alignItems: "center",
    width: "85%",
  },
  errorText: {
    fontSize: 17,
    color: "#444",
    textAlign: "center",
    marginVertical: 18,
    lineHeight: 24,
  },
  errorButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 26,
    marginTop: 12,
  },
  errorButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
