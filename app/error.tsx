"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col p-8 md:p-24 pb-24 space-y-4">
      <section className="flex flex-col space-y-4">
        <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
          Error
        </h1>
        <p className="md:text-lg">
          Something went wrong. Please try again or contact us at{" "}
          <a href="mailto:support@hypercerts.org">support@hypercerts.org</a>.
        </p>
      </section>
      <p className="md:text-lg">{error.message}</p>
    </main>
  );
}
