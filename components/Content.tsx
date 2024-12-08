import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useProducts } from "../presentation/providers/ProductsProvider";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

export function Content() {
  const { productos, deleteProduct, deleteProductoSupaBase, isConnected } =
    useProducts();

  const handleDeleteProduct = (id: number) => {
    if (isConnected) {
      deleteProductoSupaBase(id);
    } else {
      deleteProduct(id);
    }
  };

  return (
    <View
      style={{
        gap: 10,
      }}
    >
      <ThemedText type="title" style={{ color: "white" }}>
        Productos
      </ThemedText>
      {productos.map((producto, index) => (
        <Pressable
          key={index}
          style={{
            padding: 10,
            backgroundColor: "#AB4459",
            borderRadius: 10,
            shadowColor: "#000",
          }}
        >
          <View
            style={{
              gap: 4,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {`${producto.nombre}`}
              </Text>
              <Text style={{ color: "white" }}>
                Categoria: {producto.categoria}
              </Text>
              <Text style={{ color: "white" }}>Precio: ${producto.precio}</Text>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Pressable
                style={{
                  width: 30,
                  alignSelf: "flex-end",
                  justifyContent: "center",
                  alignContent: "center",
                }}
                onPress={() => handleDeleteProduct(producto.id)}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={30}
                  color="white"
                  style={{ textAlign: "center" }}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
