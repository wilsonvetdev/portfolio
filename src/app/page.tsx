import Hero from "@/components/Hero";
import { getSiteSettings } from "@/sanity/loader";

export default async function HomePage() {
  const settings = await getSiteSettings();

  return <Hero settings={settings} />;
}
