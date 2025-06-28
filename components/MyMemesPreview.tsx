"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/lib/supabase/hooks/useSession";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Meme {
  id: string;
  imageUrl: string;
  caption: string;
}

export function MyMemesPreview() {
  const { session } = useSupabaseSession();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemes() {
      if (!session?.user) return;
      try {
        const response = await fetch(
          `/api/memes?userId=${session.user.id}&limit=3`
        );
        const data = await response.json();
        setMemes(data);
      } catch (error) {
        console.error("Error fetching memes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMemes();
  }, [session?.user]);

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-4 border-t bg-gradient-to-b from-background to-muted/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16l4.586-4.586a2 2 0 012.828 0L15 16m-1-5l2.586-2.586a2 2 0 012.828 0L21 11M13 20h-2a1 1 0 01-1-1v-4h4v4a1 1 0 01-1 1z"
          />
        </svg>
        <h2 className="text-lg font-semibold mb-2">Save Your Memes</h2>
        <p className="text-muted-foreground mb-0">
          Sign in to save and access your memes anytime!
        </p>
      </div>
    );
  }

  return (
    <div className="border-t py-12 bg-gradient-to-b from-background to-muted/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium tracking-tight">Recent Memes</h2>
          <p className="text-sm text-muted-foreground">Your latest creations</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-medium"
          asChild
        >
          <Link href="/memes" className="flex items-center gap-1">
            View Gallery
            <span className="inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      ) : memes.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 p-0.5 -m-0.5">
          {memes.map((meme) => (
            <Link
              key={meme.id}
              href="/memes"
              className="group aspect-square rounded-xl overflow-hidden bg-muted relative isolate shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={meme.imageUrl}
                alt={meme.caption}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <div className="relative w-16 h-16 mx-auto mb-4 opacity-50">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-6 transform-gpu shadow-sm" />
            <div className="absolute inset-0 bg-primary/10 rounded-2xl -rotate-6 transform-gpu shadow-sm" />
            <div className="relative bg-background rounded-xl p-3 backdrop-blur-sm border border-primary/10 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-primary/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16l4.586-4.586a2 2 0 012.828 0L15 16m-1-5l2.586-2.586a2 2 0 012.828 0L21 11M13 20h-2a1 1 0 01-1-1v-4h4v4a1 1 0 01-1 1z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            No memes yet. Create one above!
          </p>
        </div>
      )}
    </div>
  );
}
