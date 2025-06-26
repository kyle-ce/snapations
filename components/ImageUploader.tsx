"use client";
import { useState, useEffect, useCallback } from "react";
import { useSupabaseSession } from "@/lib/supabase/hooks/useSession";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageDropZone } from "@/components/ImageDropZone";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { generateMemeInBrowser } from "@/lib/client-utils";

export default function ImageUploader() {
  const session = useSupabaseSession();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [memeBlob, setMemeBlob] = useState<Blob | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"ai" | "manual" | undefined>("ai");

  const generateMeme = useCallback(async (text: string) => {
    if (!image) return;
    const memeBlob = await generateMemeInBrowser(image, text);
    setMemeBlob(memeBlob);
    const url = URL.createObjectURL(memeBlob);
    setPreview(url);
  }, [image]);

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setCaption("");
  };

  // Debounce manual caption updates
  useEffect(() => {
    if (!image || mode !== "manual" || !caption) return;

    const timer = setTimeout(() => {
      generateMeme(caption).catch(console.error);
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timer);
  }, [caption, mode, image, generateMeme]);

  const generateCaption = async () => {
    if (!image) return;
    setLoading(true);
    try {
      if (mode === "ai") {
        const formData = new FormData();
        formData.append("image", image);
        const res = await fetch("/api/generate-caption", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to generate caption");
        const data = await res.json();
        setCaption(data.caption);
        await generateMeme(data.caption);
      } else {
        await generateMeme(caption);
      }
    } catch (error) {
      console.error("Error generating meme:", error);
      alert("Error generating meme");
    } finally {
      setLoading(false);
    }
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
