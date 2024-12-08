import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    useWindowDimensions,
    View,
  } from "react-native";
  import React, { useState } from "react";
  import { router } from "expo-router";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { ThemedText } from "../../../components/ThemedText";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedButton from "../../../components/ThemedButton";
import ThemedLink from "../../../components/ThemedLink";
import { useAuth } from "../../../presentation/auth/hook/useAuth";
  
  const LoginScreen = () => {
    const {login} = useAuth()
    const { height } = useWindowDimensions();
    const backgroundColor = useThemeColor({}, "background");
  
    const [isPosting, setIsPosting] = useState(false);
    const [form, setForm] = useState({
      email: "",
      password: "",
    });
  
    const onLogin = async () => {
      const { email, password } = form;
  
      if (email.length === 0 || password.length === 0) {
        Alert.alert(
          "Email y contraseña",
          "Los campos email y contraseña deben estar completos"
        );
        return;
      }  
      setIsPosting(true);
      const wasSuccessful = await login(email, password);
      setIsPosting(false);
  
      if (wasSuccessful) {
        return router.replace("/(tabs)");
      }
  
      Alert.alert("Error", "Usuario o password no son correctos");
    };
  
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {isPosting && (
          <ActivityIndicator
            size={30}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
  
        <ScrollView
          style={{
            paddingHorizontal: 40,
            backgroundColor: backgroundColor,
          }}
        >
          <View
            style={{
              paddingTop: height * 0.35,
            }}
          >
            <ThemedText type="title">Ingresar</ThemedText>
            <ThemedText
              style={{
                color: "grey",
              }}
            >
              Por favor ingreses para continuar
            </ThemedText>
  
            <View style={{ marginTop: 20 }}>
              <ThemedTextInput
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail-outline"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
              />
  
              <ThemedTextInput
                placeholder="Contrasena"
                secureTextEntry
                autoCapitalize="none"
                icon="lock-closed-outline"
                value={form.password}
                onChangeText={(value) => setForm({ ...form, password: value })}
              />
            </View>
  
            <View style={{ marginTop: 10 }} />
  
            <ThemedButton
              onPress={onLogin}
              disabled={isPosting}
              icon="arrow-forward-outline"
            >
              Ingresar
            </ThemedButton>
  
            <View style={{ marginTop: 50 }} />
  
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText>No tienes cuenta ?</ThemedText>

              <ThemedLink
                href="/auth/register"
                style={{ marginHorizontal: 5, fontSize: 16 }}

              >
                Crear cuenta
              </ThemedLink>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
  
  export default LoginScreen;
  