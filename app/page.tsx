import ImageUploader from "@/components/ImageUploader";

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Turn Any Image Into a Meme
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Upload a photo and generate a funny caption with AI — or write your
          own!
        </p>
      </section>
      <ImageUploader />
    </main>
  );
}
