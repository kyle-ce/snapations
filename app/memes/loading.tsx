"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MemesLoading() {
  // Create an array of 12 items for the loading grid
  const skeletons = Array.from({ length: 12 }, (_, i) => i);

  return (
    <section className="container py-8 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
        {skeletons.map((index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}
