import { brand } from "@/config/brand";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-24">
      <h1 className="font-display text-5xl">{brand.name}</h1>
      <p className="mt-4 text-muted">{brand.tagline}</p>
    </main>
  );
}
