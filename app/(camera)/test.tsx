import React, { useState } from "react";
import { View, Text, Button, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function App() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState<any>(null);

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    const formData: any = new FormData();
    formData.append("sheet", {
      uri: image,
      name: "sheet.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(response.data);
      Alert.alert("Success", "Sheet graded successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to process the sheet.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Grade Sheet" onPress={uploadImage} />

      {results && (
        <View style={styles.results}>
          <Text>Score: {results.score}</Text>
          <Text>Student Answers: {results.studentAnswers.join(", ")}</Text>
          <Text>Correct Answers: {results.correctAnswers.join(", ")}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  results: {
    marginTop: 20,
  },
});

//   "http://172.20.10.4:3000/grade",
