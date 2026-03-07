import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/sanity/fallback";

export default function Hero({ settings }: { settings: SiteSettings }) {
  const portraitSrc = settings.localPortrait || "/images/portrait.png";

  return (
    <section className="relative bg-accent text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary/80" />
      <div className="relative mx-auto max-w-4xl px-4 py-24 sm:py-32 text-center">
        <Image
          src={portraitSrc}
          alt={`Portrait of ${settings.name}`}
          width={200}
          height={200}
          className="mx-auto mb-8 rounded-full border-4 border-white/30 shadow-lg"
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {settings.name}
        </h1>
        <div className="mx-auto mb-8 h-px w-48 bg-white/40" />
        <p className="text-lg sm:text-xl font-light text-white/90 mb-10">
          {settings.tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-secondary px-6 py-3 font-semibold hover:bg-white/90 transition-colors"
          >
            View Projects <ArrowRight size={18} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
