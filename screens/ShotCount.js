import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system"; //delete sound record

import {
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import AsyncStorage from "@react-native-async-storage/async-storage";

const ShotCount = ({ navigation }) => {
  //const initialCount = 5; // second
  //const offsetLevel = -10; // sound level threshold in dB
  //const shotDelay = 1000; // mSec
  const countdownDelay = 1000; //mSec

  // setup parameters
  const [initialCount, setInitialCount] = useState(5);
  const [offsetLevel, setOffsetLevel] = useState(-10);
  const [shotDelay, setShotDelay] = useState(1000);
  //const [shotDelay, setShotDelay] = useState(1);

  const [count, setCount] = useState(); //countdown before recording
  const [isCounting, setIsCounting] = useState(false); //countdown flag
  const [isRecording, setIsRecording] = useState(false); //recording flag

  const [recording, setRecording] = useState(); //record vaiable
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [uri, setUri] = useState(null); //use for delete record

  const [isShot, setIsShot] = useState(false); //shot flag
  const [shotNumber, setShotNumber] = useState(0); //number of shot
  const [shotTimes, setShotTimes] = useState([]); // array to keep shot time

  const [audioMetering, setAudioMetering] = useState([]); //sound level
  const metering = useSharedValue(-100);

  //record shot time
  //const [startTime, setStartTime] = useState(null);
  //const [stopTime, setStopTime] = useState(null);
  //const [elapsed, setElapsed] = useState(null);
  const [elapsedTimes, setElapsedTimes] = useState([]);

  //play sound when count reach 0
  const playSound = async () => {
    //console.log("play sound");
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require("../sounds/triangle.mp3"));
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // time delay 1 second for countdown
  useEffect(() => {
    let intervalId;

    if (isCounting) {
      intervalId = setInterval(() => {
        if (count > 1) {
          setCount(count - 1);
        } else {
          setIsCounting(false);
          setIsRecording(true);
          clearInterval(intervalId);
          playSound();
          startRecording();
        }
      }, countdownDelay);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [count, isCounting]);

  // shot time delay to prevent side effect
  useEffect(() => {
    let timeoutId;

    if (isShot) {
      timeoutId = setTimeout(() => {
        setShotNumber(shotNumber + 1);
        // shot time stamp
        const stopTime = new Date();
        setShotTimes([...shotTimes, stopTime]);
        setIsShot(false);
      }, shotDelay); // Trigger action after 1 second
    }

    return () => clearTimeout(timeoutId);
  }, [isShot]);

  // start countdown
  const handleStart = () => {
    //read variables from Setup screen through Async storage
    retrieveData();

    //reset variables
    setIsRecording(false);
    setIsShot(false);
    setShotNumber(0);
    setShotTimes([]);
    setElapsedTimes([]);
    setIsCounting(true);
  };

  const retrieveData = async () => {
    try {
      const savedInitialCount = await AsyncStorage.getItem("initialCount");
      const savedOffsetLevel = await AsyncStorage.getItem("offsetLevel");
      const savedShotDelay = await AsyncStorage.getItem("shotDelay");

      if (savedInitialCount !== null) {
        setCount(parseInt(savedInitialCount));
      }
      if (savedOffsetLevel !== null) {
        setOffsetLevel(parseInt(savedOffsetLevel));
      }
      if (savedShotDelay !== null) {
        setShotDelay(parseInt(savedShotDelay * 1000)); //convert to mSec
      }
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
    }
    //console.log(initialCount, offsetLevel, shotDelay);
  };

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        //console.log("Requesting permission..");
        setAudioMetering([]);

        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      //start time stamp
      const shotTime = new Date();
      setShotTimes([...shotTimes, shotTime]);

      //console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        undefined,
        1000 / 60
      );
      setRecording(recording);

      recording.setOnRecordingStatusUpdate((status) => {
        /*console.log(status.metering);
        if (status.metering) {
          metering.value = status.metering;
          setAudioMetering((curVal) => [...curVal, status.metering || -100]);
        }*/
        if (status.metering) {
          metering.value = status.metering;
          if (metering.value > offsetLevel) {
            setIsShot(true); //useEffect updates shot
          }
        }
      });
      //displayElapsedTime();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }
    //console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const _uri = recording.getURI();
    setUri(_uri);
    //console.log("Recording stopped and stored at", uri);

    /*if (uri) {
      setMemos((existingMemos) => [uri, ...existingMemos]);
      setMemos((existingMemos) => [
        {uri, metering: audioMetering},
        ...existingMemos,
      ])
    }*/
    await deleteRecording(_uri); //delete record file

    setIsShot(false);
    setIsRecording(false);

    //console.log(shotTimes);
    calElapsedTime();

    setCount();
  }

  const deleteRecording = async (uri) => {
    if (!uri) return;

    try {
      await FileSystem.deleteAsync(uri);
      setUri(null);
    } catch (error) {
      console.error("Failed to delete recording", error);
    }
  };

  // calculate elapsed time and sent to List Screen
  const calElapsedTime = () => {
    if (shotTimes.length > 1) {
      const _elapsedTimes = [];
      for (let i = 0; i < shotTimes.length; i++) {
        if (i == 0) {
          //skip array [0] cos it is start time
        } else {
          const elapsed = shotTimes[i] - shotTimes[i - 1];
          _elapsedTimes.push(elapsed);
        }
      }
      //console.log(_elapsedTimes);
      //sent to list screen
      navigation.navigate("List", { _elapsedTimes });
    }
  };

  return (
    <View style={styles.container}>
      {shotNumber !== 0 && (
        <Text style={styles.shotNumber}>Shot count: {shotNumber}</Text>
      )}

      <Text style={!isRecording ? styles.count : styles.record}>
        {!isRecording ? count : "Recording ..."}
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.redButton} />
        <Button
          style={styles.buttonText}
          title={!isRecording ? "Start" : "Stop"}
          onPress={!isRecording ? handleStart : stopRecording}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    fontSize: 130,
    fontFamily: "robo",
    marginBottom: 20,
    fontWeight: "900",
  },
  record: {
    fontSize: 40,
    marginBottom: 20,
    fontWeight: "500",
    color: "red",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: 100,
    height: 100,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "white",
  },
  redButton: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  buttonText: {
    tintColor: "white",
    color: "white",
  },
  shotNumber: {
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    color: "blue",
  },
  timeText: {
    fontSize: 30,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default ShotCount;
