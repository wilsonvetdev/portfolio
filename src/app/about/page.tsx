import AboutSection from "@/components/AboutSection";
import { getAbout } from "@/sanity/loader";

export const metadata = {
  title: "About | Wilson The Vet Dev",
  description: "About Wilson Ng — Web Developer, Navy Vet, Project Manager",
};

export default async function AboutPage() {
  const about = await getAbout();

  return <AboutSection about={about} />;
}
