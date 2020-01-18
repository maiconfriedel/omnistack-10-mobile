import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

import api from "../services/api";
import { connect, disconnect, subscribeToNewDevs } from "../services/websocket";

export default function Main({ navigation }) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]);
  const [techs, seTechs] = useState("");
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // busca localização atual do usuário
  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDevs(dev => {
      setDevs([...devs, dev]);
    });
  }, [devs]);

  function setupWebsocket() {
    disconnect();

    const { latitude, longitude } = currentRegion;

    connect(latitude, longitude, techs);
  }

  // busca os devs na api
  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get("/search", {
      params: {
        latitude,
        longitude,
        techs
      }
    });
    setDevs(response.data.devs);
    Keyboard.dismiss();
    setupWebsocket();
  }

  // troca o estado da região quando move o mapa
  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  // se não tiver carregado a região não renderiza nada
  if (!currentRegion) {
    return null;
  }

  Keyboard.addListener("keyboardDidShow", e => {
    setKeyboardHeight(e.endCoordinates.height + 40);
    setKeyboardShow(true);
  });

  Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardShow(false);
  });

  const styleFlatten = StyleSheet.flatten([
    styles.searchForm,
    {
      bottom: keyboardShow ? keyboardHeight : 10
    }
  ]);

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        style={styles.map}
        initialRegion={currentRegion}
      >
        {devs &&
          devs.map(dev => (
            <Marker
              coordinate={{
                latitude: dev.location.coordinates[1],
                longitude: dev.location.coordinates[0]
              }}
              key={dev._id}
            >
              <Image
                style={styles.avatar}
                source={{
                  uri: dev.avatar_url
                }}
              />
              <Callout
                onPress={() => {
                  navigation.navigate("Profile", {
                    github_username: dev.github_username
                  });
                }}
              >
                <View style={styles.callout}>
                  <Text style={styles.devName}>
                    {dev.name || dev.github_username}
                  </Text>
                  <Text style={styles.devBio}>{dev.bio}</Text>
                  <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>
      <View style={styleFlatten}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={seTechs}
        />
        <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
          <Text>
            <MaterialIcons name="my-location" size={20} color="#fff" />
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#fff"
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: "bold",
    fontSize: 16
  },
  devBio: {
    color: "#666",
    marginTop: 5
  },
  devTechs: {
    marginTop: 5
  },
  searchForm: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 5,
    flexDirection: "row"
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8E4DFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5
  }
});
