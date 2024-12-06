import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

export function Content() {
  const db = useSQLiteContext();
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Producto>("SELECT * FROM productos");
      setProductos(result);
    }
    setup();
  }, [db]);

  const handleDelete = async (producto: Producto) => {
    console.log(producto);

    if (producto.id) {
      try {
        await db.runAsync("DELETE FROM productos WHERE id = ?", producto.id);

        const updatedProductos = await db.getAllAsync<Producto>(
          "SELECT * FROM productos"
        );
        setProductos(updatedProductos);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  return (
    <View
      style={{
        gap: 10,
      }}
    >
      <ThemedText type="title">Productos</ThemedText>
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
                onPress={() => handleDelete(producto)}
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
