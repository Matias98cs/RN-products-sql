import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInputProps,
  StyleSheet,
  TextInput,
  ViewStyle,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import { useRef, useState } from "react";

interface Props extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedTextInput = ({ icon, style, ...rest }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const primaryColor = useThemeColor({}, "secundary");
  const textColor = useThemeColor({}, "text");

  return (
    <View
      style={[
        {
          ...styles.border,
          borderColor: isActive ? primaryColor : "#cccccc",
        },
        StyleSheet.flatten(style) as ViewStyle,
      ]}
      onTouchStart={() => inputRef.current?.focus()}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color={textColor}
          style={{ marginHorizontal: 5 }}
        />
      )}
      <TextInput
        ref={inputRef}
        placeholderTextColor={textColor}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        style={{
          color: textColor,
          marginRight: 10,
          flex: 1,
        }}
        {...rest}
      />
    </View>
  );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
