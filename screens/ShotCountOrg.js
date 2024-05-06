import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const ShotCount = () => {
  const initialCount = 10;
  const [count, setCount] = useState(initialCount);
  const [isCounting, setIsCounting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isCounting) {
      intervalId = setInterval(() => {
        if (count > 0) {
          setCount(count - 1);
        } else {
          setIsCounting(false);
          setIsRecording(true);
          clearInterval(intervalId);
        }
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [count, isCounting]);

  const handleStart = () => {
    setIsCounting(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>
        {isRecording ? "Start recording" : count}
      </Text>
      {!isCounting && !isRecording && (
        <Button title="Start" onPress={handleStart} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    fontSize: 48,
    marginBottom: 20,
  },
});

export default ShotCount;
