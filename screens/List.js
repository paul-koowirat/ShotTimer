import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

//format time
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const List = ({ route }) => {
  const { params } = route;
  const { _elapsedTimes } = params;
  //console.log(_elapsedTimes);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Elapsed Times:</Text>
      {_elapsedTimes.map((elapsed, index) => (
        <View key={index} style={styles.rowContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.shotNumber}>Shot: {index + 1}</Text>
            <Text style={styles.details}>{formatTime(elapsed)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    //flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
    marginBottom: 30,
    marginTop: 30,
    //justifyContent: "center",
    //alignItems: "center",
    paddingLeft: 55,
  },
  rowContainer: {
    flexDirection: "row", // Arrange children horizontally
    marginBottom: 10,
    //alignItems: "center",
    //marginLeft: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    //alignItems: "center",
    justifyContent: "space-evenly",
  },
  shotNumber: {
    marginLeft: 1,
    fontSize: 25,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 20,
    //alignItems: "center",
  },
  details: {
    marginLeft: 40,
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 10,
    backgroundColor: "blue",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    top: 280,
    left: 30,
  },
});

export default List;
