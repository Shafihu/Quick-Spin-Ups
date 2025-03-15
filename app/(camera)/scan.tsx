import axios from "axios";
import { useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

const ProcessImage = () => {
  const { photoUri } = useGlobalSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const scanImage = async () => {
      if (photoUri) {
        setIsProcessing(true);
        const formData: any = new FormData();
        formData.append("sheet", {
          uri: photoUri,
          name: "sheet.jpg",
          type: "image/jpeg",
        });

        try {
          const response = await axios.post(
            "http://172.20.10.4:3000/grade",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          setResults(response.data);
          Alert.alert("Success", "Sheet graded successfully!");
        } catch (error) {
          Alert.alert("Error", "Failed to process the sheet.");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    scanImage();
  }, [photoUri]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scanned Image:</Text>
      {photoUri ? (
        <Image source={{ uri: photoUri as any }} style={styles.image} />
      ) : (
        <Text style={styles.text}>No image found.</Text>
      )}

      {isProcessing ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : (
        <Text style={styles.resultText}>{results.score}</Text>
      )}
    </View>
  );
};

export default ProcessImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  image: {
    width: "90%",
    height: "50%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    marginTop: 20,
    color: "green",
  },
});
