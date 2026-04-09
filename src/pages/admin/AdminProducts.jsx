import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useProducts } from "../../hooks/useProducts";
import { uploadProductImages } from "../../firebase/services/uploadService";
import { useCategories } from "../../hooks/useCategories";

export default function AdminProducts() {

  const { products, editProduct, removeProduct } = useProducts();
  const { categories } = useCategories();

  const [editingProduct, setEditingProduct] = useState(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const [search, setSearch] = useState("");

  const productCounts = products.reduce((acc, product) => {
      const category = product.category?.toLowerCase().trim();
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

  /* SEARCH FILTER */
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* IMAGE CHANGE */
  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    setImageFiles(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

  /* SAVE EDIT */
  const handleSave = async () => {
  try {

    let imageUrls = previewImages;
    if (imageFiles.length > 0) {

      const uploaded = await uploadProductImages(
        imageFiles,
        editingProduct.id
      );

      imageUrls = uploaded;
    }

    const { id, ...productData } = editingProduct;

    await editProduct(id, {
      ...productData,
      images: imageUrls,
    });

    setEditingProduct(null);
    setImageFiles([]);
    setPreviewImages([]);

  } catch (error) {

    console.error("Update failed:", error);

  }
};

  /* DELETE */
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    await removeProduct(id);
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

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

        <h1 className="text-2xl font-bold text-gray-800">
          Product Management
        </h1>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus size={14} />
            Add Product
          </Link>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-50 text-sm text-gray-600 uppercase">

            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredProducts.map((product) => (

              <tr key={product.id} className="border-t">

                <td className="p-4 flex items-center gap-4">

                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-14 h-14 rounded-lg object-cover border"
                  />

                  <span className="font-medium">
                    {product.name}
                  </span>

                </td>

                <td className="p-4">{product.brand}</td>

                <td className="p-4">{product.category}</td>

                <td className="p-4 font-semibold whitespace-nowrap">
                  {product.isOnSale && product.discountPrice ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        LKR {product.price}
                      </span>
                      <span className="text-black">
                        LKR {product.discountPrice}
                      </span>
                    </>
                  ) : (
                    <span>LKR {product.price}</span>
                  )}
                </td>

                <td className="p-4">

                  {product.stock > 0 ? (
                    <span className="text-green-600">
                      {product.stock} in stock
                    </span>
                  ) : (
                    <span className="text-red-500">
                      Out of stock
                    </span>
                  )}

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setPreviewImages(product.images || []);
                        setImageFiles([]);
                      }}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
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
      {editingProduct && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

          <div className="bg-white p-6 rounded-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">

            <h2 className="text-xl font-bold mb-6">
              Edit Product
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                value={editingProduct.brand}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    brand: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <select
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              >

                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name} ({productCounts[cat.name.toLowerCase()] || 0})
                  </option>
                ))}

              </select>

              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                placeholder="Discount Price"
                value={editingProduct.discountPrice || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    discountPrice: Number(e.target.value),
                    isOnSale: Number(e.target.value) > 0,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <textarea
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                rows="3"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />

              {/* IMAGE PREVIEW */}
              {previewImages.length > 0 && (

                <div className="flex gap-3 flex-wrap">

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
                        className="w-24 h-24 object-cover rounded-lg border"
                      />

                      <button
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

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 mt-6">

              <button
                onClick={() => setEditingProduct(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
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