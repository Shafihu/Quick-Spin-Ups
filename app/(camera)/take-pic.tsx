import type React from "react";
import { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera } from "lucide-react-native";

interface Result {
  question: number;
  detected: string;
  correct: boolean;
}

const ProcessShadingPaper: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [score, setScore] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      if (result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    const formData: any = new FormData();
    formData.append("image", {
      uri: uri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(
        "http://172.20.10.4:3000/api/process-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOcrText(response.data.ocrText);
      setResults(response.data.results);
      setScore(response.data.score);
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
            <Camera color="#ffffff" size={24} />
            <Text style={styles.buttonText}>Pick Image</Text>
          </TouchableOpacity>

          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}

          {isProcessing ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.resultsContainer}>
              {score && <Text style={styles.scoreText}>Score: {score}</Text>}
              {results && (
                <View style={styles.resultsGrid}>
                  {results.map((result) => (
                    <View
                      key={result.question}
                      style={[
                        styles.resultItem,
                        {
                          backgroundColor: result.correct
                            ? "#d4edda"
                            : "#f8d7da",
                        },
                      ]}
                    >
                      <Text style={styles.questionText}>
                        Q{result.question}
                      </Text>
                      <Text style={styles.answerText}>{result.detected}</Text>
                      <Text style={styles.correctText}>
                        {result.correct ? "✓" : "✗"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              {ocrText && (
                <View style={styles.ocrContainer}>
                  <Text style={styles.ocrTitle}>OCR Result:</Text>
                  <Text style={styles.ocrText}>{ocrText}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  pickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 8,
  },
  resultsContainer: {
    width: "100%",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  resultItem: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  answerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  correctText: {
    fontSize: 24,
  },
  ocrContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
  },
  ocrTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ocrText: {
    fontSize: 14,
  },
});

export default ProcessShadingPaper;
