import {
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    useWindowDimensions,
    View,
  } from "react-native";
  import { router } from "expo-router";
import { useState } from "react";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { ThemedText } from "../../../components/ThemedText";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedButton from "../../../components/ThemedButton";
import ThemedLink from "../../../components/ThemedLink";
import { useAuth } from "../../../presentation/auth/hook/useAuth";
  
  const RegisterScreen = () => {
    const {register} = useAuth()
    const { height } = useWindowDimensions();
    const [isPosting, setIsPosting] = useState(false);
    const [form, setForm] = useState({
      fullName: "",
      email: "",
      password: "",
    });
  
    const backgroundColor = useThemeColor({}, "background");
  
    const onRegister = async () => {
      const { email, password, fullName } = form;
  
      if (email.length === 0 || password.length === 0 || fullName.length === 0) {
        return;
      }
  
      setIsPosting(true);
      const wasSuccessful = await register(email, password);
      setIsPosting(false);
  
      if (wasSuccessful) {
        return router.replace("/auth/login");
      }
  
      Alert.alert("Error", "Error al intentar crear la cuenta");
    };
  
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
            <ThemedText type="title">Crear cuenta</ThemedText>
            <ThemedText
              style={{
                color: "grey",
              }}
            >
              Por favor crea una cuenta para continuar
            </ThemedText>
  
            <View style={{ marginTop: 20 }}>
              <ThemedTextInput
                placeholder="Nombre completo"
                autoCapitalize="words"
                icon="person-outline"
                value={form.fullName}
                onChangeText={(value) => setForm({ ...form, fullName: value })}
              />
  
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
              onPress={onRegister}
              disabled={isPosting}
              icon="arrow-forward-outline"
            >
              Crear cuenta
            </ThemedButton>
  
            <View style={{ marginTop: 50 }} />
  
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText>Ya tienes cuenta ?</ThemedText>
  
              <ThemedLink href="/auth/login" style={{ marginHorizontal: 5 }}>
                Ingresar
              </ThemedLink>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
  
  export default RegisterScreen;
  