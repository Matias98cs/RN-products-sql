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

const StackHome = () => {
  const { isConnected } = useProducts();
  const { height } = useWindowDimensions();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#1B1833",
      }}
    >
      <View style={{ marginHorizontal: 20, paddingTop: height * 0.08 }}>
        <Header isConnected={isConnected} />
        <Content />
      </View>
    </ScrollView>
  );
};

export default StackHome;