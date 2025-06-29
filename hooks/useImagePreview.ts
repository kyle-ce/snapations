import { useState, useCallback } from 'react';

export const useImagePreview = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = useCallback((file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const clearImage = useCallback(() => {
    setImage(null);
    setPreview(null);
  }, []);

  return {
    image,
    preview,
    setPreview,
    handleImageChange,
    clearImage,
  };
};
