"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function ImageUploader() {
  const { data: session } = useSession();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setCaption(""); // reset caption on new image
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setCaption("");
  };

  const handleSave = async () => {
    if (!session) {
      alert("Please sign in to save your meme.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image as File);
      formData.append("caption", caption);

      const res = await fetch("/api/save-meme", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Saved!");
      } else {
        const error = await res.json();
        alert("Failed: " + error.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function generateCaption() {
    if (!image) return;
    setLoading(true);

    // create form data
    const formData = new FormData();
    formData.append("image", image);

    // send to API route
    const res = await fetch("/api/generate-caption", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setCaption(data.caption);
    } else {
      setCaption("Error generating caption");
    }

    setLoading(false);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <label
        htmlFor="file-upload"
        className="group flex flex-col items-center justify-center w-full h-48 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-accent transition"
      >
        <FaCloudUploadAlt className="w-10 h-10 mb-2 text-muted-foreground group-hover:text-foreground" />
        <p className="text-sm text-muted-foreground">
          Click to upload or drag & drop
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {preview && (
        <div className="mt-4 relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <FaTimes className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      )}

      {image && (
        <div className="mt-4 flex flex-col gap-2">
          <Button
            onClick={generateCaption}
            variant="outline"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Caption"}
          </Button>
          {caption && (
            <Textarea readOnly value={caption} className="resize-none" />
          )}
          {image && caption && (
            <button onClick={handleSave} className="btn btn-save">
              Save Meme
            </button>
          )}
        </div>
      )}
    </div>
  );
}
