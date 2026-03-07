export const PROJECTS_QUERY = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  slug,
  image,
  description,
  bullets,
  linkUrl,
  linkType,
  order
}`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  image,
  description,
  bullets,
  linkUrl,
  linkType
}`;

export const ABOUT_QUERY = `*[_type == "about"][0] {
  _id,
  bio,
  education,
  skills,
  certifications,
  passion,
  extracurriculars,
  mediumUrl,
  likes,
  dislikes
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  _id,
  name,
  tagline,
  portrait,
  location,
  socialLinks,
  copyright
}`;
