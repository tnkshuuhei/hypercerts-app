import { SpaceIcon, Sparkle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * HypercertCard component
 * @param {string} title - The title of the card
 * @param {string} description - The description of the card
 * @param {string} banner - The banner image of the card
 * @param {string} logo - The logo image of the card
 * @param {string} link - The link of the card
 * @param {boolean} displayOnly - Whether the card is just for show (will not be clickable) or not
 */
interface HypercertCardProps {
  title?: string;
  description?: string;
  banner?: string;
  logo?: string;
  link?: string;
  displayOnly?: boolean;
}

const defaultValues: HypercertCardProps = {
  title: "Your title here",
  description: "Your description here",
};

const HypercertCard = ({
  title,
  description,
  banner,
  logo,
  link,
  displayOnly = false,
}: HypercertCardProps = defaultValues) => {
  title = title ?? defaultValues.title;
  description = description ?? defaultValues.description;

  const CardContent = () => (
    <article className="relative w-[330px] h-[380px] rounded-xl border border-gray-200 overflow-clip">
      <header className="relative h-[150px] w-full object-contain rounded-b-xl overflow-clip z-0">
        {banner ? (
          <Image src={banner} alt={`${title} banner`} layout="fill" />
        ) : (
          <div className="flex items-center justify-center bg-slate-200 h-full w-full">
            <span className="text-slate-500 text-lg">Your banner here</span>
          </div>
        )}
      </header>
      <section className="absolute top-36 left-10 -translate-x-1/2 -translate-y-1/2 border-white border-4 rounded-full overflow-hidden">
        {logo ? (
          <Image src={logo!} alt={`${title} logo`} width={40} height={40} />
        ) : (
          <div className="flex items-center justify-center bg-slate-300 h-10 w-10">
            <Sparkle size={24} />
          </div>
        )}
      </section>
      <section className="pt-5 px-3 pb-3 rounded-t-xl">
        <h5 className="text-xl font-semibold">{title}</h5>
        <p className="line-clamp-3 leading-snug tracking-normal pt-1">
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
};

export { HypercertCard as default };
