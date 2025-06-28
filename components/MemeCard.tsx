"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface MemeCardProps {
  selected?: boolean;
  id: string;
  imageUrl: string;
  caption: string;
  hideDelete?: boolean;
}

export function MemeCard({ id, imageUrl, caption, hideDelete, selected }: MemeCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meme?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/delete-meme/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete meme");
      }

      toast({
        title: "Meme Removed",
        description: "The meme has been deleted from your collection.",
        className: "bg-white dark:bg-white text-green-600 dark:text-green-500 border-green-600 dark:border-green-500"
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting meme:", error);
      toast({
        title: "Delete Failed",
        description: "We couldn't delete your meme right now. Try again in a moment.",
        className: "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive"
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative rounded-md overflow-hidden">
      <div className="relative group">
        <Image
          src={imageUrl}
          alt={caption}
          width={500}
          height={500}
          className="w-full h-auto"
        />
        {hideDelete ? (
          <div className="absolute top-2 right-2 transition-all transform scale-100 group-hover:scale-110">
            <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${selected ? 'bg-primary border-primary' : 'border-black/40 dark:border-white/40 bg-transparent'}`}>
              {selected && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
            </div>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 h-5 w-5 rounded border-2 border-black/40 dark:border-white/40 bg-transparent hover:bg-destructive hover:border-destructive group transition-all transform scale-100 hover:scale-110 flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            {isDeleting ? (
              <LoaderCircle className="h-3.5 w-3.5 text-black/40 dark:text-white/40 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5 text-black/40 dark:text-white/40 group-hover:text-white stroke-[3]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
