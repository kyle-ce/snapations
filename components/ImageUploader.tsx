"use client";
import { useState, useEffect, useCallback } from "react";
import { useSupabaseSession } from "@/lib/supabase/hooks/useSession";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageDropZone } from "@/components/ImageDropZone";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { generateMemeInBrowser } from "@/lib/caption";
import {
  LoaderCircle,
  Save,
  Wand2,
  TextQuote,
  Type,
  Heading,
} from "lucide-react";
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
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const { toast } = useToast();

  // Track if there's a pending meme generation
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMeme = useCallback(
    async (text: string) => {
      if (!image) return;
      setIsGenerating(true);
      try {
        const memeBlob = await generateMemeInBrowser(image, text, fontSize);
        setMemeBlob(memeBlob);
        const url = URL.createObjectURL(memeBlob);
        setPreview(url);
      } catch (error) {
        console.error("Error generating meme:", error);
        toast({
          title: "Couldn't Add Caption",
          description:
            "We couldn't add your caption to the image. Try a shorter caption or refresh the page.",
          className:
            "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [image, toast, fontSize]
  );

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setCaption("");
  };

  // Debounce manual caption updates
  useEffect(() => {
    if (!image || mode !== "manual" || !caption) return;
    // Regenerate meme when font size changes
    generateMeme(caption);
  }, [fontSize, generateMeme, caption, image, mode]);

  useEffect(() => {
    if (!image || mode !== "manual" || !caption) return;

    const timer = setTimeout(() => {
      generateMeme(caption).catch((error) => {
        console.error("Error in debounced caption update:", error);
        toast({
          title: "Caption Not Updated",
          description:
            "We couldn't update your meme with the new caption. Try a shorter caption or refresh the page.",
          className:
            "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive",
        });
      });
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timer);
  }, [caption, mode, image, generateMeme, toast]);

  const generateCaption = async () => {
    if (!image) return;
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
    setLoading(true);
    try {
      if (mode === "ai") {
        const formData = new FormData();
        formData.append("image", image);
        const res = await fetch("/api/generate-caption", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to generate caption");
        }
        const data = await res.json();
        setCaption(data.caption);
        await generateMeme(data.caption);
      } else {
        await generateMeme(caption);
      }
    } catch (error) {
      console.error("Error generating caption:", error);
      toast({
        title: "AI Caption Not Generated",
        description:
          "Our AI is having trouble being creative right now. Try uploading a clearer image or try again in a moment.",
        className:
          "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMeme = async () => {
    if (!session) {
      toast({
        title: "Sign In Required",
        description:
          "You'll need to sign in to save your memes. Click the sign in button above.",
        className:
          "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive",
      });
      return;
    }

    // If we're in manual mode and there's a pending generation, wait for it
    if (mode === "manual" && isGenerating) {
      toast({
        title: "One Moment",
        description: "We're adding your latest caption to the meme...",
      });
      return;
    }

    if (!memeBlob) {
      toast({
        title: "No Meme to Save",
        description:
          "Looks like there's no meme ready to save. Try generating a caption first.",
        className:
          "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive",
      });
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

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save meme");
      }

      toast({
        title: "Meme Saved!",
        description: "Your meme is now in your collection.",
        className:
          "bg-white dark:bg-white text-green-600 dark:text-green-500 border-green-600 dark:border-green-500",
      });
    } catch (error) {
      console.error("Error saving meme:", error);
      toast({
        title: "Save Failed",
        description:
          "We couldn't save your meme right now. Try again in a moment.",
        className:
          "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-card shadow-xl animate-in fade-in duration-500">
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
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs text-muted-foreground">Size:</span>
                    <TooltipProvider>
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setFontSize("small")}
                              className={`p-1.5 rounded transition-colors ${
                                fontSize === "small"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              <TextQuote className="h-3.5 w-3.5" />
                              <span className="sr-only">Small Font</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="flex items-center gap-2"
                          >
                            <TextQuote className="h-4 w-4" />
                            <span>Small Font</span>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setFontSize("medium")}
                              className={`p-1.5 rounded transition-colors ${
                                fontSize === "medium"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              <Type className="h-3.5 w-3.5" />
                              <span className="sr-only">Medium Font</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="flex items-center gap-2"
                          >
                            <Type className="h-4 w-4" />
                            <span>Medium Font</span>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setFontSize("large")}
                              className={`p-1.5 rounded transition-colors ${
                                fontSize === "large"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              <Heading className="h-3.5 w-3.5" />
                              <span className="sr-only">Large Font</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="flex items-center gap-2"
                          >
                            <Heading className="h-4 w-4" />
                            <span>Large Font</span>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mt-2"
                    placeholder="Enter your caption..."
                  />
                </div>
              )}

              <div className="grid gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex gap-2">
                  {mode === "ai" && (
                    <Button
                      onClick={generateCaption}
                      disabled={loading || !image}
                      title={
                        !session
                          ? "Sign in to use AI caption generation"
                          : undefined
                      }
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Caption
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={saveMeme}
                    disabled={saving || !image || isGenerating}
                    size={mode === "ai" ? "icon" : "default"}
                    className={mode === "ai" ? "" : "w-full"}
                  >
                    {saving ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : isGenerating ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {mode === "manual" && (
                          <span className="ml-2">Save Meme</span>
                        )}
                      </>
                    )}
                  </Button>
                </div>
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
