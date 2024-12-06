import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "../../components/ThemedText";
import { useProducts } from "../../presentation/providers/ProductsProvider";

interface ProductForm {
  nombre: string;
  precio: string | number;
  categoria: string;
}

const AddProductScreen = () => {
  const { addProduct, addProductSupaBase, isConnected} = useProducts();
  const { height } = useWindowDimensions();

  const [productForm, setProductForm] = useState<ProductForm>({
    nombre: "",
    precio: "",
    categoria: "",
  });

  const handleSavProduct = () => {
    console.log(productForm);

    if (!productForm.nombre || !productForm.precio || !productForm.categoria) {
      Alert.alert("Todos los campos son obligatorios");
      return;
    }

    const precio = parseFloat(productForm.precio.toString());
    if (isNaN(precio)) {
      Alert.alert("El precio debe ser un número válido");
      return;
    }

    const sendData = {
      nombre: productForm.nombre,
      precio,
      categoria: productForm.categoria,
    };

    if (isConnected) {
      addProductSupaBase(sendData)
    } else {
      addProduct(sendData);
    }

    setProductForm({ nombre: "", precio: "", categoria: "" });
    Alert.alert("Producto agregado con éxito");
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#1B1833",
      }}
    >
      <View style={{ marginHorizontal: 20, paddingTop: height * 0.08 }}>
        <ThemedText type="title">Agregar Productos</ThemedText>
      </View>

      <View style={{ marginHorizontal: 20, paddingTop: 10, gap: 15 }}>
        <View style={{ gap: 4 }}>
          <ThemedText>Precio</ThemedText>
          <TextInput
            style={{
              height: 60,
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 10,
              color: "white",
              paddingLeft: 10,
            }}
            placeholder="Ingrese precio"
            keyboardType="numeric"
            placeholderTextColor={"gray"}
            value={productForm.precio.toString()}
            onChangeText={(text) =>
              setProductForm({ ...productForm, precio: text })
            }
          />
        </View>
        <View style={{ gap: 4 }}>
          <ThemedText>Nombre</ThemedText>
          <TextInput
            style={{
              height: 60,
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 10,
              color: "white",
              paddingLeft: 10,
            }}
            placeholder="Nombre del producto"
            keyboardType="ascii-capable"
            placeholderTextColor={"gray"}
            value={productForm.nombre}
            onChangeText={(text) =>
              setProductForm({ ...productForm, nombre: text })
            }
          />
        </View>

        <View style={{ gap: 4 }}>
          <ThemedText>Categoría</ThemedText>
          <TextInput
            style={{
              height: 60,
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 10,
              color: "white",
              paddingLeft: 10,
            }}
            placeholder="Nombre del producto"
            keyboardType="ascii-capable"
            placeholderTextColor={"gray"}
            value={productForm.categoria}
            onChangeText={(text) =>
              setProductForm({ ...productForm, categoria: text })
            }
          />
        </View>
        <View style={{ gap: 4 }}>
          <Pressable
            style={{
              backgroundColor: "#AB4459",
              borderRadius: 10,
              padding: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => handleSavProduct()}
          >
            <ThemedText>Guardar Producto</ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddProductScreen;
