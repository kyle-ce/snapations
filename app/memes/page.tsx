import EmptyState from "./_components/Empty";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { MemeCard } from "@/components/MemeCard";

export default async function MyMemesPage() {
  const { user } = await getAuthenticatedUser();

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
        <MemeCard
          key={meme.id}
          id={meme.id}
          imageUrl={meme.imageUrl}
          caption={meme.caption}
        />
      ))}
    </section>
  );
}
