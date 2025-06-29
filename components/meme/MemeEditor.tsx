"use client";

import { useState, useEffect } from "react";
import { useSupabaseSession } from "@/lib/supabase/hooks/useSession";
import { ImageDropZone } from "@/components/ImageDropZone";
import { useToast } from "@/components/ui/use-toast";
import { CaptionControls } from "./CaptionControls";
import { MemeActions } from "./MemeActions";
import { useImagePreview } from "@/hooks/useImagePreview";
import { useMemeGeneration } from "@/hooks/useMemeGeneration";
import { useClipboard } from "@/hooks/useClipboard";

export function MemeEditor() {
  const { session } = useSupabaseSession();
  const { toast } = useToast();
  const { image, preview, handleImageChange, clearImage, setPreview } =
    useImagePreview();
  const { memeBlob, isGenerating, loading, generateMeme, generateAICaption } =
    useMemeGeneration(image);
  const { copying, copyBlobToClipboard } = useClipboard();

  const [caption, setCaption] = useState<string>("");
  const [mode, setMode] = useState<"ai" | "manual" | undefined>("ai");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );

  // Handle manual caption updates with debouncing
  useEffect(() => {
    if (!image || mode !== "manual" || !caption) return;

    const timer = setTimeout(() => {
      generateMeme(caption, fontSize).then((url) => {
        if (url) setPreview(url);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [caption, mode, image, fontSize, generateMeme, setPreview]);

  const handleGenerateCaption = async () => {
    if (!session) {
      toast({
        title: "Sign In Required",
        description:
          "You'll need to sign in to use AI captions. Click the sign in button above.",
        className:
          "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive",
      });
      return;
    }

    const generatedCaption = await generateAICaption();
    if (generatedCaption) {
      setCaption(generatedCaption);
      const url = await generateMeme(generatedCaption, fontSize);
      if (url) setPreview(url);
    }
  };

  const handleCopyMeme = async () => {
    if (mode === "manual" && isGenerating) {
      toast({
        title: "One Moment",
        description: "We're adding your latest caption to the meme...",
      });
      return;
    }

    await copyBlobToClipboard(memeBlob);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-card shadow-xl animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="w-full">
          <ImageDropZone
            preview={preview}
            onChange={(file) => {
              handleImageChange(file);
              setCaption("");
            }}
            onClear={clearImage}
          />
        </div>

        <div className={`space-y-6 ${!image ? "hidden md:block" : ""}`}>
          {image ? (
            <>
              <CaptionControls
                mode={mode}
                setMode={setMode}
                fontSize={fontSize}
                setFontSize={setFontSize}
                caption={caption}
                setCaption={setCaption}
              />

              <MemeActions
                mode={mode}
                loading={loading}
                copying={copying}
                isGenerating={isGenerating}
                onGenerate={handleGenerateCaption}
                onCopy={handleCopyMeme}
                disabled={!image}
                session={!!session}
              />
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
