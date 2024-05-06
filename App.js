import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as Splashscreen from "expo-splash-screen";
import { useCallback } from "react";

import Tabs from "./Tabs";

export default function App() {
  const [fontsLoaded] = useFonts({
    mon: require("./assets/fonts/Montserrat-Regular.ttf"),
    "mon-sb": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "mon-b": require("./assets/fonts/Montserrat-Bold.ttf"),
    robo: require("./assets/fonts/Robofan.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await Splashscreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  // call Tab
  return <Tabs />;
}
