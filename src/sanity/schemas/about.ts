import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "string",
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "badgeUrl", title: "Badge URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "passion",
      title: "Passion",
      type: "string",
    }),
    defineField({
      name: "extracurriculars",
      title: "Extracurricular Activities",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mediumUrl",
      title: "Medium Profile URL",
      type: "url",
    }),
    defineField({
      name: "likes",
      title: "Likes",
      type: "string",
    }),
    defineField({
      name: "dislikes",
      title: "Dislikes",
      type: "string",
    }),
  ],
});
