"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MemeCardProps {
  id: string;
  imageUrl: string;
  caption: string;
}

export function MemeCard({ id, imageUrl, caption }: MemeCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meme?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/delete-meme?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete meme");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting meme:", error);
      alert("Failed to delete meme");
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative rounded-md overflow-hidden">
      <div className="relative bg-black">
        <Image
          src={imageUrl}
          alt={caption}
          width={500}
          height={500}
          className="w-full h-auto"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
