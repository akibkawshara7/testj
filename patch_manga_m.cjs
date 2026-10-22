const fs = require("fs");
const file = "src/components/MangaMaintenance.tsx";
let content = `import { Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, Tv, Compass, Calendar, ArrowRight, Sparkles } from "lucide-react";

interface MangaMaintenanceProps {
  title?: string;
  subtitle?: string;
}

export function MangaMaintenance({
  title = "Manga Reader",
  subtitle = "The manga catalog and reader are currently in development. Check back soon for an immersive reading experience!",
}: MangaMaintenanceProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16 sm:px-6">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="relative mx-auto mb-8 size-28 sm:size-32">
            <div className="absolute inset-0 rounded-full bg-[var(--brand,#df7426)]/20 blur-2xl animate-pulse" />
            <div className="relative flex size-full items-center justify-center rounded-3xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl">
              <BookOpen className="size-12 text-[var(--brand,#df7426)] opacity-80" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--brand)] mb-5">
            <span className="size-2 rounded-full bg-[var(--brand)] animate-pulse" />
            <span>Coming Soon</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              to="/anime"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand,#df7426)] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95"
            >
              <Tv className="size-4" />
              <span>Watch Anime</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/anime/browse"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
            >
              <Compass className="size-4 text-muted-foreground" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
`;
fs.writeFileSync(file, content);
console.log("Updated MangaMaintenance");
