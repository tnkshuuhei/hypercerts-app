import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Create",
  description:
    "Want to create a new hypercert or hyperboard? Get started here.",
};

export default function Create() {
  return (
    <>
      <main className="flex flex-col p-8 md:p-24 pb-24">
        <section>
          <h1 className="font-serif text-5xl lg:text-8xl tracking-tight">
            Create
          </h1>
          <div className="p-1"></div>
          <p className="md:text-lg">
            Want to create a new hypercert or hyperboard? Get started here.
          </p>
        </section>

        <div className="p-3"></div>
        <section className="flex flex-col space-y-2">
          <Link href="/create/hypercert" className="group">
            <article className="p-3 border-[1.5px] border-border rounded-md flex flex-col space-y-2">
              <h2 className="text-2xl lg:text-4xl tracking-tight font-medium">
                Hypercert
              </h2>
              <p>Create a hypercert for a specific work and its impact.</p>
              <Button className="flex space-x-2" variant="outline">
                Create hypercert
                <ArrowRight
                  size={18}
                  className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 transition-transform duration-300 ease-in-out"
                  aria-hidden="true"
                />
              </Button>
            </article>
          </Link>
          <Link href="/create/hyperboard" className="group">
            <article className="p-3 border-[1.5px] border-border rounded-md flex flex-col space-y-2">
              <div className="flex flex-col space-y-2">
                <h2 className="text-2xl lg:text-4xl tracking-tight font-medium">
                  Hyperboard
                </h2>
                <p>
                  Create a hyperboard to showcase contributors to your
                  hypercerts.
                </p>
              </div>
              <Button className="flex space-x-2" variant="outline">
                Explore hyperboards
                <ArrowRight
                  size={18}
                  className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 transition-transform duration-300 ease-in-out"
                  aria-hidden="true"
                />
              </Button>
            </article>
          </Link>
        </section>
      </main>
    </>
  );
}
