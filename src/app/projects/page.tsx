import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/sanity/loader";

export const metadata = {
  title: "Projects | Wilson The Vet Dev",
  description: "Portfolio projects by Wilson Ng",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary uppercase">
            Portfolio
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 bg-primary rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
