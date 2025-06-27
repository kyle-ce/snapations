"use client";
import { useState, useEffect, useCallback } from "react";
import { useSupabaseSession } from "@/lib/supabase/hooks/useSession";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageDropZone } from "@/components/ImageDropZone";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { generateMemeInBrowser } from "@/lib/caption";
import { LoaderCircle } from "lucide-react";
import { useToast } from "./ui/use-toast";

export default function ImageUploader() {
  const { session } = useSupabaseSession();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [memeBlob, setMemeBlob] = useState<Blob | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"ai" | "manual" | undefined>("ai");
  const { toast } = useToast();

  const generateMeme = useCallback(
    async (text: string) => {
      if (!image) return;
      const memeBlob = await generateMemeInBrowser(image, text);
      setMemeBlob(memeBlob);
      const url = URL.createObjectURL(memeBlob);
      setPreview(url);
    },
    [image]
  );

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
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to use AI caption generation.",
      });
      return;
    }
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
    console.log("Session", session);
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
    try {
      setSaving(true);
      const res = await fetch("/api/save-meme", {
        method: "POST",
        body: formData,
      });
      toast({
        title: "Success",
        description: "Meme saved ",
      });
      console.log(res.ok ? "Saved!" : "Failed: " + (await res.json()).error);
    } catch (error) {
      console.error("Error saving meme:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save meme. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-card animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="w-full">
          <ImageDropZone
            preview={preview}
            onChange={(file) => {
              setImage(file);
              setPreview(URL.createObjectURL(file));
              setCaption("");
            }}
            onClear={clearImage}
          />
        </div>

        <div className={`space-y-6 ${!image ? "hidden md:block" : ""}`}>
          {image ? (
            <>
              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(val) => {
                  if (val) setMode(val as "ai" | "manual" | undefined);
                }}
                className="w-full animate-in fade-in slide-in-from-bottom-1 duration-500"
              >
                <ToggleGroupItem value="ai" className="flex-1 relative">
                  AI Caption
                </ToggleGroupItem>
                <ToggleGroupItem value="manual" className="flex-1">
                  Write My Own
                </ToggleGroupItem>
              </ToggleGroup>

              {mode === "manual" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-500">
                  <Textarea
                    placeholder="Write your caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
              )}
              {mode === "ai" && caption && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-500">
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              <div className="grid gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {mode === "ai" && (
                  <Button
                    onClick={generateCaption}
                    disabled={loading || !image}
                    title={
                      !session
                        ? "Sign in to use AI caption generation"
                        : undefined
                    }
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate AI Caption"
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="w-full"
                  disabled={!caption}
                >
                  {saving && (
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save Meme
                </Button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Upload an image to start creating your meme</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
