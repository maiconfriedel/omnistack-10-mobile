import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

export default function Main() {
  function handleClick() {
    Alert.alert("Teste de Alerta", "Esse é um teste de alerta", [
      {
        text: "Ok"
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <Text>Expo Works!</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleClick()}>
        <Text style={styles.buttonText}>Clique Aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 15
  },
  button: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#8e44ad",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20
  },
  buttonText: {
    color: "#fff"
  }
});
