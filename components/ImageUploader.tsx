"use client";
import { useState } from "react";
import { useSupabaseSession } from "@/lib/supabase/hooks/useSession";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageDropZone } from "@/components/ImageDropZone";

export default function ImageUploader() {
  const session = useSupabaseSession();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setCaption("");
  };

  const generateCaption = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    const res = await fetch("/api/generate-caption", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setCaption(res.ok ? data.caption : "Error generating caption");
    setLoading(false);
  };

  const handleSave = async () => {
    if (!session) {
      alert("Please sign in to save your meme.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image as File);
    formData.append("caption", caption);

    const res = await fetch("/api/save-meme", {
      method: "POST",
      body: formData,
    });

    alert(res.ok ? "Saved!" : "Failed: " + (await res.json()).error);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <ImageDropZone
        preview={preview}
        onChange={(file) => {
          setImage(file);
          setPreview(URL.createObjectURL(file));
          setCaption("");
        }}
        onClear={clearImage}
      />

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
          {caption && (
            <button onClick={handleSave} className="btn btn-save">
              Save Meme
            </button>
          )}
        </div>
      )}
    </div>
  );
}
