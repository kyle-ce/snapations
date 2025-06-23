import EmptyState from "./_components/Empty";

export default async function MyMemesPage() {
  // you'll query Supabase here
  const memes = []; // replace with real data

  if (!memes.length) {
    return <EmptyState />;
  }

  return <div>{/* Render meme grid here */}</div>;
}
