import { getClient } from "./client";
import {
  PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  ABOUT_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";
import {
  fallbackProjects,
  fallbackAbout,
  fallbackSiteSettings,
  type Project,
  type About,
  type SiteSettings,
} from "./fallback";

export async function getProjects(): Promise<Project[]> {
  const client = getClient();
  if (!client) return fallbackProjects;
  try {
    const projects = await client.fetch<Project[]>(PROJECTS_QUERY);
    return projects.length > 0 ? projects : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const client = getClient();
  if (!client) {
    return fallbackProjects.find((p) => p.slug.current === slug);
  }
  try {
    const project = await client.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, {
      slug,
    });
    return project ?? fallbackProjects.find((p) => p.slug.current === slug);
  } catch {
    return fallbackProjects.find((p) => p.slug.current === slug);
  }
}

export async function getAbout(): Promise<About> {
  const client = getClient();
  if (!client) return fallbackAbout;
  try {
    const about = await client.fetch<About | null>(ABOUT_QUERY);
    return about ?? fallbackAbout;
  } catch {
    return fallbackAbout;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const client = getClient();
  if (!client) return fallbackSiteSettings;
  try {
    const settings = await client.fetch<SiteSettings | null>(
      SITE_SETTINGS_QUERY
    );
    return settings ?? fallbackSiteSettings;
  } catch {
    return fallbackSiteSettings;
  }
}
