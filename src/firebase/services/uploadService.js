import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

export const uploadProductImages = async (files, productId) => {
  const urls = [];

  for (let i = 0; i < files.length; i++) {

    const file = files[i];

    const imageRef = ref(
      storage,
      `products/${productId}/${productId}-${i + 1}.jpg`
    );

    await uploadBytes(imageRef, file);

    const url = await getDownloadURL(imageRef);

    urls.push(url);
  }

  return urls;
};

export const uploadCategoryImage = async (file) => {

  const fileName = `categories/${Date.now()}-${file.name}`;

  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  return url;

};

export const uploadHeroImage = async (file, slotIndex) => {

  const fileName = `hero/homepage/slot-${slotIndex + 1}-${Date.now()}-${file.name}`;

  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  return url;

};

export const uploadPromoImage = async (file) => {
  const fileName = `promo/${Date.now()}-${file.name}`;

  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
};