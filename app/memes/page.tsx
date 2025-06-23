import EmptyState from "./_components/Empty";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function MyMemesPage() {
  const { user, error } = await getAuthenticatedUser();

  if (!user) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Please sign in to view your memes.
      </div>
    );
  }

  const memes = await prisma.memes.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!memes.length) {
    return <EmptyState />;
  }

  return (
    <section className="p-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {memes.map((meme) => (
        <div
          key={meme.id}
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <Image
            src={meme.imageUrl}
            alt={meme.caption}
            width={400}
            height={400}
            className="w-full h-auto object-cover"
          />
          <div className="p-3 text-sm text-muted-foreground border-t">
            {meme.caption}
          </div>
        </div>
      ))}
    </section>
  );
}
