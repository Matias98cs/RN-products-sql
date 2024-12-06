import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useProducts } from "../../presentation/providers/ProductsProvider";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#A6A6A6",
        headerShadowVisible: false,
        headerShown: false,
        headerTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
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
              color={"white"}
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
              color={"white"}
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
              color={"white"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
