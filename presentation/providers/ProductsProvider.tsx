import { useSQLiteContext } from "expo-sqlite";
import NetInfo from '@react-native-community/netinfo';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

interface ProductsContextValue {
  productos: Producto[];
  reloadProducts: () => Promise<void>;
  addProduct: (producto: Omit<Producto, "id">) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  isConnected: boolean;
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

 useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsConnected(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    reloadProducts();
  }, []);

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
      await reloadProducts();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await db.runAsync("DELETE FROM productos WHERE id = ?", id);
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <ProductsContext.Provider
      value={{ productos, reloadProducts, addProduct, deleteProduct, isConnected }}
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
