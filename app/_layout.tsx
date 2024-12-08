import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "../hooks/useColorScheme";
import { migrateDbIfNeeded } from "../database/db";
import { SQLiteProvider } from "expo-sqlite";
import { ProductsProvider } from "../presentation/providers/ProductsProvider";
import { Fallback } from "../components/Fallback";
import { AuthProvider } from "../presentation/auth/provider/AuthPriver";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<Fallback />}>
      <SQLiteProvider
        databaseName="myDataBase.db"
        onInit={migrateDbIfNeeded}
        useSuspense={true}
      >
        <AuthProvider>
          {/* <ProductsProvider> */}
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            ></Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
          {/* </ProductsProvider> */}
        </AuthProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
