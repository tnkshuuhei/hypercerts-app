import Image from "next/image";
import Link from "next/link";
import { Sparkle } from "lucide-react";
import { forwardRef } from "react";

/**
 * HypercertCard component
 * @param {string} name - The name of the hypercert
 * @param {string} description - The description of the hypercert
 * @param {string} banner - The banner image of the hypercert
 * @param {string} logo - The logo image of the hypercert
 * @param {string} link - The link of the hypercert
 * @param {boolean} displayOnly - Whether the card is just for display (non-interactive) or not
 * @param {string} hypercertId - The unique identifier for the hypercert
 */
export interface HypercertCardProps {
  name?: string;
  description?: string;
  banner?: string;
  logo?: string;
  fromDateDisplay?: string | null;
  toDateDisplay?: string | null;
  displayOnly?: boolean;
  hypercertId?: string;
}

const defaultValues: HypercertCardProps = {
  name: "Your title here",
  description: "Your description here",
};

const HypercertCard = forwardRef<HTMLDivElement, HypercertCardProps>(
  (
    {
      name: title,
      description,
      banner,
      fromDateDisplay,
      toDateDisplay,
      hypercertId,
      displayOnly = false,
    }: HypercertCardProps = defaultValues,
    ref
  ) => {
    title = title ?? defaultValues.name;
    description = description ?? defaultValues.description;

    const formattedDateRange =
      fromDateDisplay && toDateDisplay
        ? fromDateDisplay === toDateDisplay
          ? fromDateDisplay
          : `${fromDateDisplay} - ${toDateDisplay}`
        : "";

    const CardContent = () => (
      <article
        ref={ref}
        className="relative w-[275px] h-[250px] rounded-xl border-[1.5px] border-slate-500 overflow-clip bg-black"
      >
        <header className="relative h-[150px] w-full flex items-center justify-center rounded-b-xl overflow-clip">
          {banner ? (
            <Image
              src={banner}
              alt={`${title} banner`}
              className="object-cover object-center"
              fill
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center bg-slate-200 h-full w-full">
              <span className="text-slate-500 text-lg">Your banner here</span>
            </div>
          )}
          <div className="absolute inset-0 mix-blend-luminosity w-full h-full">
            <Image
              src={"/hc-guilloche.svg"}
              alt="Guilloche"
              className="object-cover opacity-25"
              fill
              unoptimized
            />
          </div>
        </header>
        {/* <section className="absolute top-16 left-3 border-white border-2 rounded-full overflow-hidden bg-slate-200">
          <div className="relative w-7 h-7 flex items-center justify-center border border-slate-300 rounded-full overflow-hidden">
            {logo ? (
              <Image src={logo} alt={`${title} logo`} fill unoptimized />
            ) : (
              <div className="flex items-center justify-center bg-slate-300 h-10 w-10">
                <Sparkle size={24} />
              </div>
            )}
          </div>
        </section> */}
        <section className="p-3 rounded-t-xl h-full bg-white border-t-[1.5px] border-black space-y-2">
          <h5
            className="text-base font-semibold text-slate-800 line-clamp-2 text-ellipsis tracking-tight leading-tight"
            title={title}
          >
            {title}
          </h5>
          <div className="flex items-center">
            <span className="text-sm text-slate-500">{formattedDateRange}</span>
          </div>
        </section>
      </article>
    );
    return displayOnly ? (
      <CardContent />
    ) : (
      <Link
        href={hypercertId ? `/hypercert/${hypercertId}` : "#"}
        passHref
        className="w-max hover:-translate-y-1 transition-transform duration-200 ease-[cubic-bezier(.44,.95,.63,.96)]"
      >
        <CardContent />
      </Link>
    );
  }
);

HypercertCard.displayName = "HypercertCard";

export { HypercertCard as default };
