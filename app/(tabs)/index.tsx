import {
  View,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { Content } from "../../components/Content";
import { useProducts } from "../../presentation/providers/ProductsProvider";
import { Header } from "../../components/Header";
import { useThemeColor } from "../../hooks/useThemeColor";
import { ThemedText } from "../../components/ThemedText";
import { useAuth } from "../../presentation/auth/hook/useAuth";

const StackHome = () => {
  const { user } = useAuth();
  const { height } = useWindowDimensions();
  const colorPrimary = useThemeColor({}, "primary");

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colorPrimary,
      }}
    >
      <View style={{ marginHorizontal: 20, paddingTop: height * 0.08 }}>
        <ThemedText>{user?.email}</ThemedText>
        <ThemedText style={{ marginTop: 20 }} type="title">
          Gastos
        </ThemedText>
      </View>
    </ScrollView>
  );
};

export default StackHome;
