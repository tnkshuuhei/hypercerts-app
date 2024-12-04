import { Separator } from "@/components/ui/separator";

interface ErrorStateProps {
  message: string;
  hypercertId?: string;
}

export default function ErrorState({ message, hypercertId }: ErrorStateProps) {
  return (
    <section className="flex flex-col space-y-4">
      <section className="space-y-4 lg:flex lg:space-y-0 lg:space-x-8">
        <div className="flex justify-between">
          <h2 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
            Oops! Something went wrong...
          </h2>
        </div>
      </section>
      <section className="flex flex-col space-y-4">
        <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
          {message}
        </h1>
        <Separator />
        {hypercertId && (
          <pre className="uppercase text-sm text-slate-500 font-medium tracking-wider">
            {`ID: ${hypercertId}`}
          </pre>
        )}
        <p className="md:text-lg">
          If this issue persists, please try again or contact us at{" "}
          <a href="mailto:support@hypercerts.org">support@hypercerts.org</a>.
        </p>
      </section>
    </section>
  );
}
