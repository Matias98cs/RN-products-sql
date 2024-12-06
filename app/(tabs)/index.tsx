import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React, { Suspense, useEffect, useState } from "react";
import { getDatabasePath, migrateDbIfNeeded } from "../../database/db";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Content } from "../../components/Content";

const StackHome = () => {
  const { height } = useWindowDimensions();
  useEffect(() => {
    const initDatabase = async () => {
      const dbPath = await getDatabasePath();
    };

    initDatabase();
  }, []);

  useEffect(() => {}, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#1B1833",
      }}
    >
      <View style={{ marginHorizontal: 20, paddingTop: height * 0.08 }}>
        <Suspense fallback={<Fallback />}>
          <SQLiteProvider
            databaseName="myDataBase.db"
            onInit={migrateDbIfNeeded}
            useSuspense={true}
          >
            <Header />
            <Content />
          </SQLiteProvider>
        </Suspense>
      </View>
    </ScrollView>
  );
};

export default StackHome;

export const Fallback = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={"white"} size={35} />
    </View>
  );
};

export function Header() {
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
    <View style={{ marginVertical: 10 }}>
      <Text style={{ color: "white" }}>SQLite version: {version}</Text>
    </View>
  );
}
