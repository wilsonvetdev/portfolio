import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/sanity/fallback";

export default function ProjectDetail({ project }: { project: Project }) {
  const imageSrc = project.localImage || "/images/portrait.png";

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-2">
          {project.title}
        </h1>
        <div className="h-1 w-16 bg-primary rounded mb-8" />

        <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
          <Image
            src={imageSrc}
            alt={`Screenshot of ${project.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        <ul className="space-y-4 mb-10">
          {project.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-3 text-foreground/80">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <a
          href={project.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
        >
          {project.linkType === "site" ? (
            <>
              <ExternalLink size={18} /> Visit Site
            </>
          ) : (
            <>
              <Github size={18} /> Visit Repo
            </>
          )}
        </a>
      </div>
    </section>
  );
}
