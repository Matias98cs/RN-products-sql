// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

interface PropsHeader {
  isConnected: boolean;
}

export function Header({ isConnected }: PropsHeader) {
  const [version, setVersion] = useState("");
  const db = useSQLiteContext();
  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ "sqlite_version()": string }>(
        "SELECT sqlite_version()"
      );
      setVersion(result["sqlite_version()"]);
    }
    setup();
  }, [db]);
  return (
    <View
      style={{
        marginVertical: 10,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ flex: 1 }}>SQLite version: {version}</Text>

      <View
        style={{
          width: "30%",
          justifyContent: "flex-end",
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
        }}
      >
        <Text>Internet:</Text>
        <Ionicons
          name={`${isConnected ? "checkmark-circle" : "checkmark-circle"}`}
          color={"black"}
          size={25}
        />
      </View>
    </View>
  );
}
