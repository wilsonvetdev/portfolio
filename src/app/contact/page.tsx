import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact | Wilson The Vet Dev",
  description: "Get in touch with Wilson Ng",
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary uppercase">
            Contact Me
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 bg-primary rounded" />
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
