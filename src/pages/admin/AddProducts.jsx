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
    discountPrice: "",
    stock: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* IMAGE UPLOAD */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    setImageFiles(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

  /* DRAG */
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

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

  /* VALIDATION */
  const validateForm = () => {
    const price = Number(formData.price);
    const discount = Number(formData.discountPrice);

    if (discount && discount >= price) {
      setError("Discount price must be less than actual price");
      return false;
    }

    setError("");
    return true;
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const productId = Date.now().toString();

      let imageUrls = [];

      if (imageFiles.length > 0) {
        imageUrls = await uploadProductImages(imageFiles, productId);
      } else {
        imageUrls = ["/default-product.jpg"];
      }

      await createProduct({
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice) || null,
        isOnSale: Number(formData.discountPrice) > 0,
        stock: Number(formData.stock),
        images: imageUrls
      });

      navigate("/admin/products");

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 flex justify-center">

      <div className="w-full max-w-5xl">

        <h1 className="text-3xl font-bold mb-8">
          Add New Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow border space-y-8"
        >

          {/* BASIC */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="label">Product Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="input" />
            </div>

            <div>
              <label className="label">Brand</label>
              <input name="brand" value={formData.brand} onChange={handleChange} required className="input" />
            </div>

          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required className="input" />
          </div>

          {/* CATEGORY + PRICE */}
          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label className="label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="input">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Price (LKR)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="input" />
            </div>

            <div>
              <label className="label">Discount Price</label>
              <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="input" />
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* STOCK */}
          <div>
            <label className="label">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="input" />
          </div>

          {/* IMAGE */}
          <div>
            <label className="label">Product Images</label><br /><br />

            {/* HIDDEN INPUT */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />

            {/* CUSTOM BUTTON */}
            <label
              htmlFor="imageUpload"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer border"
            >
              Choose Images
            </label>

            {/* FILE COUNT */}
            {imageFiles.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {imageFiles.length} image(s) selected
              </p>
            )}

            {/* IMAGE PREVIEW */}
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">

                {previewImages.map((img, index) => (

                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    className="relative cursor-move group"
                  >

                    <img
                      src={img}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />

                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>

                  </div>

                ))}

              </div>
            )}

          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}