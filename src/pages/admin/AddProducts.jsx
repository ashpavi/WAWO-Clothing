import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProducts } from "../../hooks/useProducts";
import { uploadProductImages } from "../../firebase/services/uploadService";
import { useCategories } from "../../hooks/useCategories";



export default function AddProducts() {

  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const { categories } = useCategories();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const [loading, setLoading] = useState(false);


  /* HANDLE INPUT CHANGE */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  /* HANDLE IMAGE UPLOAD */

  const handleImageUpload = (e) => {

    const files = Array.from(e.target.files);

    setImageFiles(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);

  };


  /* DRAG REORDER */

  const handleDrop = (index) => {

    const updatedPreview = [...previewImages];
    const updatedFiles = [...imageFiles];

    const draggedPreview = updatedPreview[draggedIndex];
    const draggedFile = updatedFiles[draggedIndex];

    updatedPreview.splice(draggedIndex, 1);
    updatedFiles.splice(draggedIndex, 1);

    updatedPreview.splice(index, 0, draggedPreview);
    updatedFiles.splice(index, 0, draggedFile);

    setPreviewImages(updatedPreview);
    setImageFiles(updatedFiles);

  };


  /* REMOVE IMAGE */

  const removeImage = (index) => {

    const updatedPreview = [...previewImages];
    const updatedFiles = [...imageFiles];

    updatedPreview.splice(index, 1);
    updatedFiles.splice(index, 1);

    setPreviewImages(updatedPreview);
    setImageFiles(updatedFiles);

  };


  /* HANDLE SUBMIT */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const productId = Date.now().toString();

      let imageUrls = [];

      if (imageFiles.length > 0) {

        imageUrls = await uploadProductImages(
          imageFiles,
          productId
        );

      } else {

        imageUrls = ["/default-product.jpg"];

      }

      await createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: imageUrls
      });

      navigate("/admin/products");

    } catch (error) {

      console.error("Error adding product:", error);

    }

    setLoading(false);

  };


  return (

    <div className="p-6 max-w-4xl mx-auto">

      {/* HEADER */}

      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Add New Product
      </h1>


      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border space-y-6"
      >

        {/* PRODUCT NAME */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>


        {/* BRAND */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>


        {/* DESCRIPTION */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>


        {/* CATEGORY PRICE STOCK */}

        <div className="grid md:grid-cols-3 gap-6">

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}

              </select>

          </div>


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (LKR)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

        </div>


        {/* IMAGE UPLOAD */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500"
          />


          {/* IMAGE PREVIEW */}

          {previewImages.length > 0 && (

            <div className="flex flex-wrap gap-4 mt-4">

              {previewImages.map((img, index) => (

                <div
                  key={index}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className="relative cursor-move"
                >

                  <img
                    src={img}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ACTION BUTTONS */}

        <div className="flex justify-end gap-4 pt-4">

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

        </div>

      </form>

    </div>

  );
}