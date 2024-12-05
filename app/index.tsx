import { View, Text } from "react-native";
import React, { useEffect, Suspense, useState } from "react";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";
import * as FileSystem from "expo-file-system";

async function getDatabasePath() {
  const documentDirectory = FileSystem.documentDirectory;
  const dbDirectory = `${documentDirectory}SQLite/`;

  const dirInfo = await FileSystem.getInfoAsync(dbDirectory);

  if (dirInfo.exists) {
    if (dirInfo.isDirectory) {
      console.log("Directorio existe.");
    } else {
      await FileSystem.deleteAsync(dbDirectory);
      console.log("Archivo conflictivo eliminado.");
      await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
    }
  } else {
    await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
  }

  console.log(`${dbDirectory}myDataBase.db`);
  return `${dbDirectory}myDataBase.db`;
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
  `);
    await db.runAsync(
      "INSERT INTO todos (value, intValue) VALUES (?, ?)",
      "hello",
      1
    );
    await db.runAsync(
      "INSERT INTO todos (value, intValue) VALUES (?, ?)",
      "world",
      2
    );
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

interface Todo {
  value: string;
  intValue: number;
}

const App = () => {
  useEffect(() => {
    const initDatabase = async () => {
      const dbPath = await getDatabasePath();
      console.log("Database Path:", dbPath);
    };

    initDatabase();
  }, []);

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
    <View>
      <Text style={{ color: "white" }}>SQLite version: {version}</Text>
    </View>
  );
}

interface Todo {
  value: string;
  intValue: number;
}

interface Todo {
  value: string;
  intValue: number;
}

const Content = () => {
  const db = useSQLiteContext();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Todo>("SELECT * FROM todos");
      setTodos(result);
    }
    setup();
  }, [db]);

  return (
    <View>
      {todos.map((todo, index) => (
        <View key={index}>
          <Text style={{ color: "white" }}>
            {`${todo.intValue} - ${todo.value}`}
          </Text>
        </View>
      ))}
    </View>
  );
};
export const Fallback = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white" }}>Loading...</Text>
    </View>
  );
};
