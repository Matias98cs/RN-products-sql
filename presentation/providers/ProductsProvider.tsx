import { useSQLiteContext } from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../../database/supabase/db.supabase";
import { Alert } from "react-native";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

interface newProducto {
  nombre: string;
  precio: number;
  categoria: string;
}

interface ProductsContextValue {
  productos: Producto[];
  isConnected: boolean;
  isSyncing: boolean;
  reloadProducts: () => Promise<void>;
  addProduct: (producto: Omit<Producto, "id">) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  deleteProductoSupaBase: (id: number) => Promise<void>;
  addProductSupaBase: (producto: newProducto) => Promise<void>;
  syncProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined
);

export const ProductsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const db = useSQLiteContext();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  console.log("Sincronizing Products", isSyncing)
  console.log("Conectado?", isConnected)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      setIsConnected(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addProductSupaBase = async (producto: newProducto) => {
    const { data, error } = await supabase
      .from("productos")
      .insert([
        {
          nombre: producto.nombre,
          precio: producto.precio,
          categoria: producto.categoria,
        },
      ])
      .select();

    if (error) {
      console.error("Error al agregar producto:", error.message);
    } else {
      console.log("Producto agregado:", data[0].id);
      if (data) {
        setProductos((prevProductos) => [...prevProductos, data[0]]);
      }
    }
  };

  const reloadProducts = async () => {
    try {
      const allProducts = await db.getAllAsync<Producto>(
        "SELECT * FROM productos"
      );
      setProductos(allProducts);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  const addProduct = async (producto: Omit<Producto, "id">) => {
    try {
      await db.runAsync(
        "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)",
        producto.nombre,
        producto.precio,
        producto.categoria
      );
      // await reloadProducts();
      setProductos((prevProductos) => [
        ...prevProductos,
        { id: Date.now(), ...producto },
      ]);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  const deleteProductoSupaBase = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id);
      if (error) {
        Alert.alert("Hubo un error al intentar borrar un producto");
        console.error("Hubo un error al intentar borrar un producto", error);
        return;
      }
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto.id !== id)
      );
    } catch (error) {
      console.log("Hubo un error al intentar borrar un producto", error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await db.runAsync("DELETE FROM productos WHERE id = ?", id);
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto.id !== id)
      );
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      if (!isSyncing) {
        syncProducts();
      }
    }
  }, [isConnected]);

  const syncProducts = async () => {
    setIsSyncing(true);

    try {
      const localProducts = await db.getAllAsync<Producto>(
        "SELECT * FROM productos"
      );

      if (localProducts.length > 0) {
        await Promise.all(
          localProducts.map(async (producto) => {
            const { data, error } = await supabase
              .from("productos")
              .upsert([{ ...producto }]);

            if (error) {
              console.error(
                "Error al agregar producto a Supabase:",
                error.message
              );
            } else {
              console.log("Producto sincronizado:", data);
            }
          })
        );
      }

      await getProductsFromSupabase();
    } catch (error) {
      console.error("Error durante la sincronización:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getProductsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from("productos").select("*");
      if (error) {
        throw new Error(error.message);
      }
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos de Supabase:", error);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        productos,
        isConnected,
        isSyncing,
        reloadProducts,
        addProduct,
        deleteProduct,
        addProductSupaBase,
        syncProducts,
        deleteProductoSupaBase,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextValue => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts debe ser usado dentro de un ProductsProvider");
  }
  return context;
};
