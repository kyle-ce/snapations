import EmptyState from "./_components/Empty";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { MemeGrid } from "@/components/MemeGrid";

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
    <section className="container py-8 mx-auto">
      <MemeGrid memes={memes} pageSize={12} />
    </section>
  );
}
