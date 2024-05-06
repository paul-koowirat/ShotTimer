import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

import ShotCount from "./screens/ShotCount";
import List from "./screens/List";
import Setup from "./screens/Setup";

const Tab = createBottomTabNavigator();
//const data = [6, 7, 8, 9, 10];

const Tabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={ShotCount}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size, color }) => {
            let iconName;
            if (route.name === "ShotCount") {
              iconName = focused ? "timer" : "timer-outline";
              size = focused ? size + 8 : size + 5;
            } else if (route.name === "List") {
              iconName = focused ? "list" : "list-outline";
              size = focused ? size + 8 : size + 5;
            } else if (route.name === "Setup") {
              iconName = focused ? "settings" : "settings-outline";
              size = focused ? size + 8 : size + 5;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="ShotCount" component={ShotCount} />
        <Tab.Screen name="List" component={List} />
        <Tab.Screen name="Setup" component={Setup} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Tabs;
