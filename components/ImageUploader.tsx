"use client";
import { useState } from "react";
import { useSupabaseSession } from "@/lib/supabase/hooks/useSession";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageDropZone } from "@/components/ImageDropZone";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default function ImageUploader() {
  const session = useSupabaseSession();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [memeBlob, setMemeBlob] = useState<Blob | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"ai" | "manual" | undefined>("ai");

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
    if (mode === "manual") formData.append("caption", caption);
    const res = await fetch("/api/generate-caption", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const { caption, meme } = await res.json();
      setCaption(caption);
      const blob = await (await fetch(`data:image/png;base64,${meme}`)).blob();
      const url = URL.createObjectURL(blob);
      setPreview(url);
      setMemeBlob(blob);
    } else {
      alert("Error generating meme");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!session) {
      alert("Please sign in to save your meme.");
      return;
    }
    if (!memeBlob) {
      alert("No meme image to save.");
      return;
    }

    const file = new File([memeBlob as Blob], "meme.png", {
      type: "image/png",
    });
    const formData = new FormData();
    formData.append("image", file);
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
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => {
              if (val) setMode(val as "ai" | "manual" | undefined);
            }}
            className="mb-4"
          >
            <ToggleGroupItem value="ai">Use AI Caption</ToggleGroupItem>
            <ToggleGroupItem value="manual">Write My Own</ToggleGroupItem>
          </ToggleGroup>
          {mode === "manual" && (
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your meme caption here..."
            />
          )}
          <Button
            onClick={generateCaption}
            variant="outline"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Caption"}
          </Button>

          {preview && (
            <button onClick={handleSave} className="btn btn-save">
              Save Meme
            </button>
          )}
        </div>
      )}
    </div>
  );
}
