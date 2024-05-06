import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Setup = () => {
  const [initialCount, setInitialCount] = useState(5);
  const [offsetLevel, setOffsetLevel] = useState(-10);
  const [shotDelay, setShotDelay] = useState(1);
  const navigation = useNavigation();

  const saveToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem("initialCount", initialCount.toString());
      await AsyncStorage.setItem("offsetLevel", offsetLevel.toString());
      await AsyncStorage.setItem("shotDelay", shotDelay.toString());
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  const saveSetup = async () => {
    await saveToAsyncStorage();
    navigation.navigate("ShotCount");
  };

  const reset = () => {
    setInitialCount(5);
    setOffsetLevel(-10);
    setShotDelay(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.slideHeader}>
        <Text style={styles.text}>Count Down : </Text>
        <Text style={styles.text}>{initialCount} Second(s)</Text>
      </View>
      <Slider
        style={{ width: screenWidth * 0.9, height: 40 }}
        minimumValue={0}
        maximumValue={10}
        step={1}
        minimumTrackTintColor="#00ff00"
        maximumTrackTintColor="#ff0000"
        value={initialCount}
        onValueChange={(value) => setInitialCount(value)}
      />

      <View style={styles.slideHeader}>
        <Text style={styles.text}>Offset Level : </Text>
        <Text style={styles.text}>{offsetLevel} dB</Text>
      </View>
      <Slider
        style={{ width: screenWidth * 0.9, height: 40 }}
        minimumValue={-40}
        maximumValue={0}
        step={1}
        minimumTrackTintColor="#00ff00"
        maximumTrackTintColor="#ff0000"
        value={offsetLevel}
        onValueChange={(value) => setOffsetLevel(value)}
      />

      <View style={styles.slideHeader}>
        <Text style={styles.text}>Shot Delay : </Text>
        <Text style={styles.text}>{shotDelay} Second(s)</Text>
      </View>
      <Slider
        style={{ width: screenWidth * 0.9, height: 40 }}
        minimumValue={0}
        maximumValue={5}
        step={0.5}
        minimumTrackTintColor="#00ff00"
        maximumTrackTintColor="#ff0000"
        value={shotDelay}
        onValueChange={(value) => setShotDelay(value)}
      />
      <View style={styles.buttonRowContainer}>
        <View style={styles.buttonItemContainer}>
          <TouchableOpacity style={styles.button} onPress={saveSetup}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: "#fff",
    marginLeft: 10,
    //alignItems: "center",
    //justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  slideHeader: {
    flexDirection: "row",
    //alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonRowContainer: {
    flexDirection: "row",
    //justifyContent: "space-around",
    justifyContent: "space-evenly",
    //width: "80%",
  },
  buttonItemContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    //justifyContent: "space-evenly",
    width: "80%",
    marginTop: 20,
    padding: 5,
  },
  button: {
    marginTop: 20,
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 10,
    backgroundColor: "blue",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
export default Setup;
