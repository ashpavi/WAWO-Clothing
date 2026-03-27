import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebaseConfig";

const categoryCollection = collection(db, "categories");


/* GET ALL CATEGORIES */

export const getCategories = async () => {

  const snapshot = await getDocs(categoryCollection);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

};


/* ADD CATEGORY */

export const addCategory = async (categoryData) => {

  const docRef = await addDoc(categoryCollection, categoryData);

  return docRef.id;

};


/* UPDATE CATEGORY */

export const updateCategory = async (id, updatedData) => {

  const categoryRef = doc(db, "categories", id);

  await updateDoc(categoryRef, updatedData);

};


/* DELETE CATEGORY */

export const deleteCategory = async (id) => {

  const categoryRef = doc(db, "categories", id);

  await deleteDoc(categoryRef);

};