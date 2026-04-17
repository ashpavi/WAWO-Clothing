import { createContext, useEffect, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getProductById,
  updateProduct
} from "../firebase/services/productService";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= REALTIME PRODUCTS ================= */

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(data); 
        setLoading(false);
      },
      (error) => {
        console.error("Realtime error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, []);

  /* ================= GET PRODUCT BY ID ================= */

  const fetchProductById = async (id) => {
    try {
      return await getProductById(id);
    } catch (error) {
      console.error("Failed to fetch product", error);
      return null;
    }
  };

  /* ================= ADD PRODUCT ================= */

  const createProduct = async (productData) => {
    await addProduct(productData); 
  };

  /* ================= UPDATE PRODUCT ================= */

  const editProduct = async (id, updatedData) => {
    await updateProduct(id, updatedData); 
  };

  /* ================= DELETE PRODUCT ================= */

  const removeProduct = async (id) => {
    await deleteProduct(id); 
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProductById,
        createProduct,
        editProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};