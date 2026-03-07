import SkillBadge from "./SkillBadge";
import { Anchor, BookOpen } from "lucide-react";
import type { About } from "@/sanity/fallback";

export default function AboutSection({ about }: { about: About }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary uppercase">
            About
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 bg-primary rounded" />
        </div>

        <p className="text-lg leading-relaxed text-foreground/80 mb-10">
          {about.bio}
        </p>

        <div className="space-y-8">
          <Block title="Education">
            <p className="text-foreground/80">{about.education}</p>
          </Block>

          <Block title="Skills / Tools">
            <div className="flex flex-wrap gap-2">
              {about.skills.map((skill) => (
                <SkillBadge
                  key={skill.name}
                  name={skill.name}
                  badgeUrl={skill.badgeUrl}
                />
              ))}
            </div>
          </Block>

          <Block title="Certifications">
            <ul className="space-y-1">
              {about.certifications.map((cert, i) => (
                <li key={i} className="flex gap-2 text-foreground/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {cert}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Passion">
            <p className="text-foreground/80">{about.passion}</p>
          </Block>

          <Block title="Extracurricular Activities">
            <div className="flex flex-wrap items-center gap-3 text-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <Anchor size={16} className="text-primary" />
                {about.extracurriculars}
              </span>
              {about.mediumUrl && (
                <a
                  href={about.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:text-primary-dark transition-colors"
                >
                  <BookOpen size={16} />
                  Professional Writer on Medium
                </a>
              )}
            </div>
          </Block>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Block title="Likes">
              <p className="text-foreground/80">{about.likes}</p>
            </Block>
            <Block title="Dislikes">
              <p className="text-foreground/80">{about.dislikes}</p>
            </Block>
          </div>
        </div>
      </div>
    </section>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-secondary mb-2">{title}</h2>
      {children}
    </div>
  );
}
