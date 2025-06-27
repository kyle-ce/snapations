"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="flex flex-col lg:flex-row gap-6 px-4 py-12 max-w-6xl mx-auto min-h-screen animate-in fade-in duration-500">
      {/* Left Column - Image Preview Skeleton */}
      <div className="flex-1">
        <Skeleton className="w-full aspect-video rounded-xl" />
      </div>

      {/* Right Column - Controls Skeleton */}
      <div className="w-full lg:w-[400px] space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </main>
  );
}
