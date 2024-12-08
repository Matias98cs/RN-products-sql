import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import { useProducts } from "../../presentation/providers/ProductsProvider";
import { useAuth } from "../../presentation/auth/hook/useAuth";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";

export default function TabLayout() {
  const { authStatus, user, refreshToken } = useAuth();

  useEffect(() => {
    refreshToken();
  }, []);

  if (authStatus === "checking") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={30} />
      </View>
    );
  }

  if (authStatus === "unauthenticated") {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#A6A6A6",
        headerShadowVisible: false,
        headerShown: false,
        headerTintColor: "black",
        tabBarStyle: {
          backgroundColor: "white",
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarItemStyle: {
          flexDirection: "row",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={"black"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Productos",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={24}
              color={"black"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="addProduct"
        options={{
          title: "Agregar Producto",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={24}
              color={"black"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={"black"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
