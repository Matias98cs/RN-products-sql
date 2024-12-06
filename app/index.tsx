import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, Suspense, useState } from "react";
import {
  deleteDatabase,
  getDatabasePath,
  migrateDbIfNeeded,
} from "../database/db";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Content } from "../components/Content";

const App = () => {
  useEffect(() => {
    const initDatabase = async () => {
      const dbPath = await getDatabasePath();
      console.log("Database Path:", dbPath);
    };

    initDatabase();
  }, []);

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1, marginHorizontal: 20, paddingTop: 10 }}>
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
  );
};

export default App;

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
