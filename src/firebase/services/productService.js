import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { ref, deleteObject } from "firebase/storage";

import { db, storage } from "../firebaseConfig";

/* ============================= */
/* COLLECTION REFERENCE */
/* ============================= */

const productCollection = collection(db, "products");


/* ============================= */
/* GET ALL PRODUCTS */
/* ============================= */

export const getProducts = async () => {

  const snapshot = await getDocs(productCollection);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,     // Firestore Document ID
    ...docSnap.data(),
  }));

};


/* ============================= */
/* GET SINGLE PRODUCT */
/* ============================= */

export const getProductById = async (id) => {

  const productRef = doc(db, "products", id);

  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    throw new Error("Product not found");
  }

  return {
    id: productSnap.id,
    ...productSnap.data(),
  };

};


/* ============================= */
/* ADD PRODUCT (ADMIN) */
/* ============================= */

export const addProduct = async (productData) => {

  const docRef = await addDoc(productCollection, productData);

  return docRef.id; // Firestore ID

};


/* ============================= */
/* UPDATE PRODUCT (ADMIN) */
/* ============================= */

export const updateProduct = async (id, updatedData) => {

  const productRef = doc(db, "products", id);

  await updateDoc(productRef, updatedData);

};


/* ============================= */
/* DELETE PRODUCT (ADMIN) */
/* ============================= */

export const deleteProduct = async (id) => {

  const productRef = doc(db, "products", id);

  try {

    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {

      const productData = productSnap.data();
      const images = productData.images || [];

      /* Delete images from Firebase Storage */

      const deletePromises = images.map(async (url) => {
        try {
          const imageRef = ref(storage, url);
          await deleteObject(imageRef);
        } catch (error) {
          console.log("Image delete failed:", error);
        }
      });

      await Promise.all(deletePromises);

      console.log("Product images deleted");

    }

    /* Delete Firestore document */

    await deleteDoc(productRef);

    console.log("Product deleted from Firestore");

  } catch (error) {

    console.error("Delete product failed:", error);

  }

};