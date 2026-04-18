import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "../firebaseConfig";

const homepageHeroDocRef = doc(db, "siteConfig", "homepageHero");

const normalizeSlide = (slide = {}) => ({
  tag: slide.tag || "",
  title: slide.title || "",
  subtitle: slide.subtitle || "",
  image: slide.image || "",
});

export const subscribeHomepageHeroConfig = (onData, onError) => {
  return onSnapshot(
    homepageHeroDocRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onData({ slides: [], preferredStyle: "", updatedAt: null });
        return;
      }

      const data = snapshot.data();

      onData({
        slides: Array.isArray(data.slides)
          ? data.slides.map(normalizeSlide)
          : [],
        preferredStyle: data.preferredStyle || "",
        updatedAt: data.updatedAt || null,
      });
    },
    onError
  );
};

export const saveHomepageHeroConfig = async ({ slides, preferredStyle = "" }) => {
  const cleanedSlides = (slides || [])
    .map(normalizeSlide)
    .filter((slide) => slide.image);

  await setDoc(
    homepageHeroDocRef,
    {
      slides: cleanedSlides,
      preferredStyle,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
