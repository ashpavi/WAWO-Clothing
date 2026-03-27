import { createContext, useEffect, useState } from "react";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../firebase/services/productService";



export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD ALL PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  // GET PRODUCT BY ID
  const fetchProductById = async (id) => {
    try {
      return await getProductById(id);
    } catch (error) {
      console.error("Failed to fetch product", error);
      return null;
    }
  };

  // ADD PRODUCT
  const createProduct = async (productData) => {

    const docId = await addProduct(productData);

    const newProduct = {
      ...productData,
      id: docId
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  // UPDATE PRODUCT
  const editProduct = async (id, updatedData) => {
    await updateProduct(id, updatedData);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updatedData } : p
      )
    );
  };

  // DELETE PRODUCT
  const removeProduct = async (id) => {
    await deleteProduct(id);

    setProducts((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
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