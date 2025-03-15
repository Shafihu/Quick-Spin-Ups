import { useState } from "react";
import { View, Button, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function VoiceInput({ onResult }: { onResult: any }) {
  const [isListening, setIsListening] = useState(false);

  const htmlContent = `
    <html>
    <body>
      <script>
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          window.ReactNativeWebView.postMessage(text);
        };

        recognition.onerror = (event) => {
          window.ReactNativeWebView.postMessage("ERROR: " + event.error);
        };

        function startListening() {
          recognition.start();
        }

        function stopListening() {
          recognition.stop();
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View>
      <Button
        title={isListening ? "Stop Listening" : "Start Voice Input"}
        onPress={() => {
          setIsListening(!isListening);
        }}
      />
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        onMessage={(event) => {
          onResult(event.nativeEvent.data);
          setIsListening(false);
        }}
        style={{ height: 0, width: 0 }} // Hide WebView
      />
    </View>
  );
}
