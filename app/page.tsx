import ImageUploader from "@/components/ImageUploader";
import AuthButtons from "../components/AuthButtons"; // adjust path as needed

export default function HomePage() {
  return (
    <main className="p-4">
      <h1>Choose an image to generate a caption</h1>
      <ImageUploader />
    </main>
  );
}
