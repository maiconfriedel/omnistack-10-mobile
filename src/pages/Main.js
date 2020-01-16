import React, { useEffect, useState } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";

export default function Main() {
  const [currentRegion, setCurrentRegion] = useState(null);

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

  if (!currentRegion) {
    return null;
  }

  return (
    <MapView style={styles.map} initialRegion={currentRegion}>
      <Marker
        coordinate={{
          latitude: currentRegion.latitude,
          longitude: currentRegion.longitude
        }}
      >
        <Image
          style={styles.avatar}
          source={{
            uri:
              "https://avatars0.githubusercontent.com/u/54713276?s=400&u=980cbcf8b1a4f411ea7241c98d7e67dc3d270ddf&v=4"
          }}
        />
        <Callout>
          <View style={styles.callout}>
            <Text style={styles.devName}>Maicon Gabriel Friedel</Text>
            <Text style={styles.devBio}>
              Junior System Analyst at Grupo Kyly.
            </Text>
            <Text style={styles.devTechs}>C#, .Net, React, React Native</Text>
          </View>
        </Callout>
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
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
  }
});
