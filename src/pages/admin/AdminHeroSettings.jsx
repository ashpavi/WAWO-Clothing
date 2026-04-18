import { useEffect, useState } from "react";

import {
  saveHomepageHeroConfig,
  subscribeHomepageHeroConfig,
} from "../../firebase/services/heroService";
import { uploadHeroImage } from "../../firebase/services/uploadService";

const acceptedImageTypes = ["image/jpeg", "image/png"];

const defaultSlides = [
  {
    tag: "New Collection",
    title: "Refined Essentials For Modern Living",
    subtitle: "Crafted with precision and designed for those who value timeless quality.",
    image: "",
  },
  {
    tag: "Signature Series",
    title: "Elevate Your Everyday Experience",
    subtitle: "Minimal design. Maximum impact. Discover products made to inspire.",
    image: "",
  },
  {
    tag: "Editor's Pick",
    title: "Curated For Excellence",
    subtitle: "Hand-selected premium pieces tailored to your lifestyle.",
    image: "",
  },
  {
    tag: "Limited Drop",
    title: "Streetwear That Speaks",
    subtitle: "Fresh styles designed to stand out in every season.",
    image: "",
  },
];

const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight, imageUrl });
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Failed to read image dimensions."));
    };

    img.src = imageUrl;
  });
};

export default function AdminHeroSettings() {
  const [slides, setSlides] = useState(defaultSlides);
  const [preferredStyle, setPreferredStyle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([null, null, null, null]);
  const [previewUrls, setPreviewUrls] = useState(["", "", "", ""]);
  const [dimensionWarnings, setDimensionWarnings] = useState(["", "", "", ""]);

  useEffect(() => {
    const unsubscribe = subscribeHomepageHeroConfig(
      (data) => {
        const nextSlides = defaultSlides.map((slide, index) => ({
          ...slide,
          ...(data.slides[index] || {}),
        }));

        setSlides(nextSlides);
        setPreferredStyle(data.preferredStyle || "");
        setLoading(false);
      },
      (fetchError) => {
        setError(fetchError.message || "Failed to load hero settings.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateSlideField = (index, key, value) => {
    setSlides((prev) =>
      prev.map((slide, currentIndex) =>
        currentIndex === index ? { ...slide, [key]: value } : slide
      )
    );
  };

  const handleImageChange = async (event, index) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!acceptedImageTypes.includes(file.type)) {
      setError("Only JPG and PNG files are allowed.");
      return;
    }

    setError("");

    try {
      const { width, height, imageUrl } = await getImageDimensions(file);

      setPreviewUrls((prev) =>
        prev.map((url, currentIndex) => {
          if (currentIndex === index) {
            if (url.startsWith("blob:")) {
              URL.revokeObjectURL(url);
            }
            return imageUrl;
          }

          return url;
        })
      );

      setSelectedFiles((prev) =>
        prev.map((item, currentIndex) =>
          currentIndex === index ? file : item
        )
      );

      setDimensionWarnings((prev) =>
        prev.map((warning, currentIndex) => {
          if (currentIndex !== index) return warning;

          if (width === 1920 && height === 1080) {
            return "";
          }

          return `Selected image size is ${width}x${height}. Recommended size is 1920x1080.`;
        })
      );
    } catch (imageError) {
      setError(imageError.message || "Failed to process image.");
    }
  };

  const removeSlideImage = (index) => {
    setSlides((prev) =>
      prev.map((slide, currentIndex) =>
        currentIndex === index ? { ...slide, image: "" } : slide
      )
    );

    setSelectedFiles((prev) =>
      prev.map((file, currentIndex) =>
        currentIndex === index ? null : file
      )
    );

    setPreviewUrls((prev) =>
      prev.map((url, currentIndex) => {
        if (currentIndex === index) {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
          return "";
        }

        return url;
      })
    );

    setDimensionWarnings((prev) =>
      prev.map((warning, currentIndex) =>
        currentIndex === index ? "" : warning
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const uploadedSlides = await Promise.all(
        slides.map(async (slide, index) => {
          let imageUrl = slide.image;

          if (selectedFiles[index]) {
            imageUrl = await uploadHeroImage(selectedFiles[index], index);
          }

          return {
            ...slide,
            image: imageUrl,
          };
        })
      );

      const hasAtLeastOneImage = uploadedSlides.some((slide) => slide.image);

      if (!hasAtLeastOneImage) {
        throw new Error("Upload at least one hero image before saving.");
      }

      await saveHomepageHeroConfig({
        slides: uploadedSlides,
        preferredStyle,
      });

      setSelectedFiles([null, null, null, null]);
      setSuccess("Hero settings updated successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to save hero settings.");
    }

    setSaving(false);
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading hero settings...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Hero Banner Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage homepage hero images and text from the admin panel.
        </p>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-6">
        <h2 className="text-xl font-semibold text-gray-900">3. Hero Section Background Image</h2>
        <p className="mt-2 text-gray-700">
          The hero section is the main banner displayed on the homepage.
        </p>

        <ul className="mt-4 list-disc space-y-1 pl-6 text-gray-700">
          <li>High-quality background image (recommended size: 1920x1080 px)</li>
          <li>Image format (JPG/PNG preferred)</li>
          <li>Any text or tagline to display over the image (optional)</li>
          <li>Preferred style (modern, minimal, promotional)</li>
        </ul>

        <p className="mt-4 text-sm text-amber-700">
          Note: Once finalized, changing this image may require developer support.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Preferred Style (optional)</label>
        <input
          type="text"
          value={preferredStyle}
          onChange={(event) => setPreferredStyle(event.target.value)}
          placeholder="e.g. modern, minimal, promotional"
          className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {slides.map((slide, index) => (
          <div key={index} className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Slide {index + 1}</h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tag</label>
                <input
                  type="text"
                  value={slide.tag}
                  onChange={(event) => updateSlideField(index, "tag", event.target.value)}
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(event) => updateSlideField(index, "title", event.target.value)}
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                <textarea
                  rows="3"
                  value={slide.subtitle}
                  onChange={(event) => updateSlideField(index, "subtitle", event.target.value)}
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Hero Image (JPG/PNG)</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(event) => handleImageChange(event, index)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              {(previewUrls[index] || slide.image) && (
                <img
                  src={previewUrls[index] || slide.image}
                  alt={`Slide ${index + 1}`}
                  className="h-40 w-full rounded-lg border object-cover"
                />
              )}

              {dimensionWarnings[index] && (
                <p className="text-xs text-amber-600">{dimensionWarnings[index]}</p>
              )}

              <button
                type="button"
                onClick={() => removeSlideImage(index)}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Remove Image
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? "Saving..." : "Save Hero Settings"}
      </button>
    </div>
  );
}
