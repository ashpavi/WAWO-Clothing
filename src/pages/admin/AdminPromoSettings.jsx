import { useEffect, useState } from "react";
import {
  subscribePromoConfig,
  savePromoConfig,
} from "../../firebase/services/promoService";
import { uploadPromoImage } from "../../firebase/services/uploadService";

export default function AdminPromoSettings() {
  const [promo, setPromo] = useState({
    heading: "",
    subheading: "",
    image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const unsubscribe = subscribePromoConfig(
      (data) => {
        if (data) setPromo(data);
        setLoading(false);
      },
      () => {
        setError("Failed to load promo settings.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = promo.image;

      if (selectedFile) {
        imageUrl = await uploadPromoImage(selectedFile);
      }

      await savePromoConfig({
        ...promo,
        image: imageUrl,
      });

      setSelectedFile(null);
      setSuccess("Promo updated successfully!");
    } catch {
      setError("Failed to save promo.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading promo settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Promo Section Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Customize the promotional banner shown on the homepage.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-6">

        {/* HEADING */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Heading
          </label>
          <input
            type="text"
            value={promo.heading}
            onChange={(e) =>
              setPromo({ ...promo, heading: e.target.value })
            }
            placeholder="Enter promo heading..."
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* SUBHEADING */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Subheading
          </label>
          <textarea
            rows="3"
            value={promo.subheading}
            onChange={(e) =>
              setPromo({ ...promo, subheading: e.target.value })
            }
            placeholder="Enter promo description..."
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Image
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <input
              type="file"
              onChange={handleImageChange}
              className="text-sm"
            />

            {(preview || promo.image) && (
              <img
                src={preview || promo.image}
                alt="Preview"
                className="h-32 w-full sm:w-48 object-cover rounded-xl border"
              />
            )}
          </div>
        </div>

        {/* FEEDBACK */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
            {success}
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}