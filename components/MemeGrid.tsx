"use client";

import { useState } from "react";
import { MemeCard } from "./MemeCard";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Meme {
  id: string;
  imageUrl: string;
  caption: string;
}

interface MemeGridProps {
  memes: Meme[];
  pageSize?: number;
}

export function MemeGrid({ memes, pageSize = 12 }: MemeGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(memes.length / pageSize);
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentMemes = memes.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
        {currentMemes.map((meme) => (
          <MemeCard
            key={meme.id}
            id={meme.id}
            imageUrl={meme.imageUrl}
            caption={meme.caption}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 animate-in fade-in duration-500 delay-300">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
