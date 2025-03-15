import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText } from "lucide-react-native";
import * as ImageManipulator from "expo-image-manipulator";

const CompareSheets: React.FC = () => {
  const [correctSheet, setCorrectSheet] = useState<any>(null);
  const [studentSheet, setStudentSheet] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [diffImage, setDiffImage] = useState<string | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturingFor, setCapturingFor] = useState<
    "correct" | "student" | null
  >(null);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleCapture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      if (!photo) return;

      try {
        const croppedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX: 0,
                originY: 0,
                width: photo.width * 0.8,
                height: photo.height * 0.8,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        if (capturingFor === "correct") {
          setCorrectSheet(croppedImage);
        } else if (capturingFor === "student") {
          setStudentSheet(croppedImage);
        }

        setIsCameraActive(false);
        setCapturingFor(null);
      } catch (error) {
        console.error("Error cropping image:", error);
        Alert.alert("Error", "Unable to crop the image. Please try again.");
      }
    }
  };

  const activateCamera = async (forType: "correct" | "student") => {
    await requestCameraPermission();
    if (hasPermission) {
      setIsCameraActive(true);
      setCapturingFor(forType);
    }
  };

  const handleCompareSheets = async () => {
    if (!correctSheet || !studentSheet) {
      Alert.alert("Error", "Please capture both sheets before proceeding.");
      return;
    }

    const formData: any = new FormData();
    formData.append("correctSheet", {
      uri: correctSheet.uri,
      name: "correct_sheet.png",
      type: "image/png",
    });
    formData.append("studentSheet", {
      uri: studentSheet.uri,
      name: "student_sheet.png",
      type: "image/png",
    });

    setIsProcessing(true);

    try {
      const response = await axios.post(
        "http://172.20.10.4:3000/api/compare-sheets",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setComparisonResult(response.data);

      if (response.data.diffImageBase64) {
        setDiffImage(`data:image/png;base64,${response.data.diffImageBase64}`);
      }
    } catch (error) {
      console.error("Error comparing sheets:", error);
      Alert.alert("Error", "Failed to compare sheets. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.pickButton}
          onPress={() => activateCamera("correct")}
        >
          <FileText color="#ffffff" size={24} />
          <Text style={styles.buttonText}>Capture Correct Sheet</Text>
        </TouchableOpacity>

        {correctSheet && (
          <Image source={{ uri: correctSheet.uri }} style={styles.image} />
        )}

        <TouchableOpacity
          style={styles.pickButton}
          onPress={() => activateCamera("student")}
        >
          <FileText color="#ffffff" size={24} />
          <Text style={styles.buttonText}>Capture Student Sheet</Text>
        </TouchableOpacity>

        {studentSheet && (
          <Image source={{ uri: studentSheet.uri }} style={styles.image} />
        )}

        <TouchableOpacity
          style={styles.compareButton}
          onPress={handleCompareSheets}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? "Processing..." : "Compare Sheets"}
          </Text>
        </TouchableOpacity>

        {isProcessing && <ActivityIndicator size="large" color="#0000ff" />}

        {comparisonResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Comparison Result:</Text>
            <Text>Total Questions: {comparisonResult.totalQuestions}</Text>
            <Text>Correct: {comparisonResult.correctAnswers}</Text>
            <Text>Incorrect: {comparisonResult.incorrectAnswers}</Text>
            {diffImage && (
              <Image
                source={{ uri: diffImage }}
                style={{ width: 300, height: 300, resizeMode: "contain" }}
              />
            )}
          </View>
        )}
      </ScrollView>

      {isCameraActive && (
        <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
          >
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        </CameraView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f0f0" },
  container: { flexGrow: 1, alignItems: "center", padding: 20 },
  pickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, marginLeft: 8 },
  compareButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8 },
  resultContainer: { marginTop: 20, backgroundColor: "#fff", padding: 16 },
  resultTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  camera: {
    flex: 1,
    width: "100%",
    position: "absolute",
    zIndex: 100,
    top: 0,
    left: 0,
    bottom: 9,
    right: 0,
  },
  captureButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#ff0000",
    padding: 12,
    borderRadius: 50,
  },
  captureText: { color: "#fff", fontSize: 16 },
});

export default CompareSheets;
