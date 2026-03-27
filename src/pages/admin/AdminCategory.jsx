import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import { uploadCategoryImage } from "../../firebase/services/uploadService";

export default function AdminCategory() {

  const { products } = useProducts();
  const { categories, editCategory, removeCategory } = useCategories();

  const [editingCategory, setEditingCategory] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const productCounts = products.reduce((acc, product) => {
    const category = product.category?.toLowerCase().trim();
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});


  /* DELETE */

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this category?"
    );

    if (!confirmDelete) return;

    await removeCategory(id);

  };


  /* IMAGE CHANGE */

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));

  };


  /* SAVE EDIT */

  const handleSaveEdit = async () => {

    try {

      let imageUrl = editingCategory.image;

      if (imageFile) {

        imageUrl = await uploadCategoryImage(imageFile);

      }

      const { id } = editingCategory;

      await editCategory(id, {
        name: editingCategory.name,
        image: imageUrl
      });

      setEditingCategory(null);
      setImageFile(null);
      setPreviewImage("");

    } catch (error) {

      console.error("Update failed:", error);

    }

  };


  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

        <h1 className="text-2xl font-bold text-gray-800">
          Category Management
        </h1>

        <Link
          to="/admin/categories/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus size={14} />
          Add Category
        </Link>

      </div>


      {/* TABLE */}

      <div className="bg-white rounded-xl shadow border overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-50 text-sm text-gray-600 uppercase">

            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Category</th>
              <th className="p-4">Products</th>
              <th className="p-4 text-center">Actions</th>
            </tr>

          </thead>


          <tbody>

            {categories.map((category) => (

              <tr key={category.id} className="border-t">

                {/* IMAGE */}

                <td className="p-4">

                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-14 h-14 rounded-lg object-cover border"
                  />

                </td>


                {/* NAME */}

                <td className="p-4 font-medium">
                  {category.name}
                </td>


                {/* PRODUCT COUNT */}

                <td className="p-4 text-gray-600">
                  {productCounts[category.name.toLowerCase()] || 0}
                </td>


                {/* ACTIONS */}

                <td className="p-4">

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setPreviewImage(category.image);
                        setImageFile(null);
                      }}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>


                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* EDIT MODAL */}

      {editingCategory && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-6">
              Edit Category
            </h2>


            {/* NAME */}

            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  name: e.target.value
                })
              }
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />


            {/* IMAGE */}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />


            {previewImage && (

              <img
                src={previewImage}
                className="w-32 h-32 mt-4 object-cover rounded-lg border"
              />

            )}


            {/* BUTTONS */}

            <div className="flex justify-end gap-4 mt-6">

              <button
                onClick={() => setEditingCategory(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>


              <button
                onClick={handleSaveEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}