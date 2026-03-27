import { useEffect, useState } from "react";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from "../firebase/services/categoryService";

export const useCategories = () => {

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {

    const data = await getCategories();
    setCategories(data);

  };

  useEffect(() => {

    fetchCategories();

  }, []);


  const createCategory = async (categoryData) => {

    await addCategory(categoryData);
    fetchCategories();

  };


  const editCategory = async (id, data) => {

    await updateCategory(id, data);
    fetchCategories();

  };


  const removeCategory = async (id) => {

    await deleteCategory(id);
    fetchCategories();

  };


  return {
    categories,
    createCategory,
    editCategory,
    removeCategory
  };

};