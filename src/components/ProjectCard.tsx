import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/sanity/fallback";

export default function ProjectCard({ project }: { project: Project }) {
  const imageSrc = project.localImage || "/images/portrait.png";

  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={`Screenshot of ${project.title}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/60 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold text-sm flex items-center gap-2">
            {project.linkType === "site" ? (
              <ExternalLink size={18} />
            ) : (
              <Github size={18} />
            )}
            View Details
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-sans text-lg font-bold text-secondary mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-muted line-clamp-2">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
