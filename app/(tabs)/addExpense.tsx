import { View, Text, useWindowDimensions, ScrollView } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";
import { ThemedText } from "../../components/ThemedText";

const AddExpenseScreen = () => {
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
        <ThemedText type="title">Agrega un Gasto</ThemedText>

        <View style={{ gap: 4, paddingTop: 20 }}></View>
      </View>
    </ScrollView>
  );
};

export default AddExpenseScreen;
