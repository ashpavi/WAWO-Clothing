import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCategories } from "../../hooks/useCategories";
import { uploadCategoryImage } from "../../firebase/services/uploadService";

export default function AdminAddCategory() {

  const navigate = useNavigate();
  const { createCategory } = useCategories();

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [loading, setLoading] = useState(false);


  /* HANDLE IMAGE */

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));

  };


  /* SUBMIT */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      let imageUrl = "";

      if (imageFile) {

        imageUrl = await uploadCategoryImage(imageFile);

      }

      await createCategory({
        name,
        image: imageUrl
      });

      navigate("/admin/categories");

    } catch (error) {

      console.error("Error creating category:", error);

    }

    setLoading(false);

  };


  return (

    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Add New Category
      </h1>


      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border space-y-6"
      >

        {/* CATEGORY NAME */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>


        {/* IMAGE UPLOAD */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Category Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {previewImage && (

            <img
              src={previewImage}
              alt="preview"
              className="mt-4 w-40 h-40 object-cover rounded-lg border"
            />

          )}

        </div>


        {/* BUTTONS */}

        <div className="flex justify-end gap-4 pt-4">

          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Create Category"}
          </button>

        </div>

      </form>

    </div>

  );

}