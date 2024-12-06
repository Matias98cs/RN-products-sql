import { ActivityIndicator, View } from "react-native";

export const Fallback = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={"white"} size={35} />
    </View>
  );
};
