import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "No memes yet",
  description = "Generate some hilarious captions and they'll show up here!",
  actionLabel = "Create Meme",
  actionHref = "/",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-6">{description}</p>
      <Button asChild>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
