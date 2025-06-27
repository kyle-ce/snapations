// app/page.tsx
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ImageDropZone } from "@/components/ImageDropZone";

export default function MemeGeneratorPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex flex-col lg:flex-row gap-6 px-4 py-12 max-w-6xl mx-auto min-h-screen">
      {/* Left Column - Image Preview or Drop Zone */}
      <div className="w-full lg:w-1/2">
        <ImageDropZone
          preview={preview}
          onChange={(file) => {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setCaption("");
          }}
          onClear={() => {
            setImage(null);
            setPreview(null);
            setCaption("");
          }}
        />
      </div>

      {/* Right Column - Tools */}
      <div className="w-full lg:w-1/2 space-y-4">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(val) => {
            if (val) setMode(val as "ai" | "manual");
          }}
        >
          <ToggleGroupItem value="ai">Use AI Caption</ToggleGroupItem>
          <ToggleGroupItem value="manual">Write My Own</ToggleGroupItem>
        </ToggleGroup>

        {mode === "manual" && (
          <Textarea
            placeholder="Write your meme caption here..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        )}

        <Button disabled={loading} variant="default">
          {loading ? "Generating..." : "Generate Caption"}
        </Button>

        {preview && <Button variant="secondary">Save Meme</Button>}
      </div>
    </main>
  );
}
