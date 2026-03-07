/* eslint-disable @next/next/no-img-element */

interface SkillBadgeProps {
  name: string;
  badgeUrl: string;
}

export default function SkillBadge({ name, badgeUrl }: SkillBadgeProps) {
  return (
    <img
      src={badgeUrl}
      alt={name}
      className="h-7"
      loading="lazy"
    />
  );
}
