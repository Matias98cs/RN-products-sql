import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  Pressable,
} from "react-native";
import React from "react";
import { ThemedText } from "../../components/ThemedText";
import { useAuth } from "../../presentation/auth/hook/useAuth";
import { router } from "expo-router";
import { useThemeColor } from "../../hooks/useThemeColor";

const SettingsScreen = () => {
  const { height } = useWindowDimensions();
  const colorPrimary = useThemeColor({}, "primary");
  const colorSecundary = useThemeColor({}, "secundary");

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
    console.log("Sesión cerrada");
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colorPrimary,
      }}
    >
      <View style={{ marginHorizontal: 20, paddingTop: height * 0.08 }}>
        <ThemedText type="title">Configuraciones</ThemedText>

        <View style={{ gap: 4, paddingTop: 20 }}>
          <Pressable
            style={{
              backgroundColor: colorSecundary,
              borderRadius: 10,
              padding: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleLogout}
          >
            <ThemedText style={{ color: "white" }}>Cerrar sesion</ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
