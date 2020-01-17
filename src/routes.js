import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { FontAwesome } from "@expo/vector-icons";

import Main from "./pages/Main";
import Profile from "./pages/Profile";

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: Main,
        navigationOptions: {
          title: "DevRadar"
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          title: "Perfil no Github"
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerRight() {
          return (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                paddingHorizontal: 10,
                height: 40,
                marginRight: 10,
                borderRadius: 20,
                justifyContent: "flex-end",
                alignItems: "center",
                backgroundColor: "#8E4DFF",
                flexDirection: "row"
              }}
            >
              <Text style={{ color: "#fff" }}>Maicon</Text>
              <FontAwesome
                style={{ color: "#fff", marginLeft: 10 }}
                name="user"
                size={25}
              />
            </TouchableOpacity>
          );
        },
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#7d40e7"
        },
        headerTintColor: "#fff"
      }
    }
  )
);

export default Routes;
