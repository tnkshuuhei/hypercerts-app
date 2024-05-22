import { Sparkle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";

/**
 * HypercertCard component
 * @param {string} title - The title of the card
 * @param {string} description - The description of the card
 * @param {string} banner - The banner image of the card
 * @param {string} logo - The logo image of the card
 * @param {string} link - The link of the card
 * @param {boolean} displayOnly - Whether the card is just for display (non-interactive) or not
 * @param {string} id - The unique identifier for the card
 */
interface HypercertCardProps {
  title?: string;
  description?: string;
  banner?: string;
  logo?: string;
  link?: string;
  displayOnly?: boolean;
  id?: string;
}

const defaultValues: HypercertCardProps = {
  title: "Your title here",
  description: "Your description here",
};

const HypercertCard = forwardRef<HTMLDivElement, HypercertCardProps>(
  (
    {
      title,
      description,
      banner,
      logo,
      link,
      id,
      displayOnly = false,
    }: HypercertCardProps = defaultValues,
    ref
  ) => {
    title = title ?? defaultValues.title;
    description = description ?? defaultValues.description;

    const CardContent = () => (
      <article
        ref={ref}
        className="relative w-[330px] h-[300px] rounded-xl border border-slate-300 overflow-clip bg-white"
        id={id}
      >
        <header className="relative h-[110px] w-full flex items-center justify-center rounded-b-xl overflow-clip">
          {banner ? (
            <Image
              src={banner}
              alt={`${title} banner`}
              className="object-cover"
              fill
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center bg-slate-200 h-full w-full">
              <span className="text-slate-500 text-lg">Your banner here</span>
            </div>
          )}
        </header>
        <section className="absolute top-28 left-10 -translate-x-1/2 -translate-y-1/2 border-white border-4 rounded-full overflow-hidden bg-slate-200">
          <div className="relative w-10 h-10 flex items-center justify-center border border-slate-300 rounded-full overflow-hidden">
            {logo ? (
              <Image src={logo!} alt={`${title} logo`} fill unoptimized />
            ) : (
              <div className="flex items-center justify-center bg-slate-300 h-10 w-10">
                <Sparkle size={24} />
              </div>
            )}
          </div>
        </section>
        <section className="pt-6 px-3 pb-3 rounded-t-xl h-full space-y-2">
          <h5
            className="text-xl font-semibold text-slate-800 line-clamp-2 text-ellipsis"
            title={title}
          >
            {title}
          </h5>
          <p className="leading-snug tracking-normal pt-1 text-pretty text-slate-600 overflow-ellipsis line-clamp-3">
            {description}
          </p>
        </section>
      </article>
    );
    return displayOnly ? (
      <CardContent />
    ) : (
      <Link
        href={link || "#"}
        passHref
        className="group group-hover:ring-[1.5px] group-hover:ring-slate-300 group-hover:ring-offset-2"
      >
        <CardContent />
      </Link>
    );
  }
);

HypercertCard.displayName = "HypercertCard";

export { HypercertCard as default };
