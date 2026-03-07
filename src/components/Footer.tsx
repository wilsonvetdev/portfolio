import { Linkedin, BookOpen, Github } from "lucide-react";
import type { SiteSettings } from "@/sanity/fallback";

const iconMap: Record<string, React.ElementType> = {
  linkedin: Linkedin,
  medium: BookOpen,
  github: Github,
};

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3">
              Location
            </h4>
            <p className="text-white/70">{settings.location}</p>
          </div>
          <div className="md:text-right">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3">
              Find Me Elsewhere
            </h4>
            <div className="flex gap-3 justify-center md:justify-end">
              {settings.socialLinks.map((link) => {
                const Icon = iconMap[link.platform] ?? Github;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/70 hover:border-primary hover:text-primary transition-colors"
                    aria-label={link.platform}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/50">
        Copyright &copy; {settings.copyright} {year}
      </div>
    </footer>
  );
}
