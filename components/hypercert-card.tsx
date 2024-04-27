import Image from "next/image";

const HypercertCard = () => {
  return (
    <article className="relative max-w-[350px] rounded-xl border border-gray-200 bg-swhite hover:ring-[1.5px] hover:ring-slate-300 hover:ring-offset-2 overflow-clip">
      <header className="relative h-[150px] w-full object-cover rounded-b-xl overflow-clip z-0">
        <Image
          src="/hypercert-banner.png"
          alt="Project banner placeholder"
          layout="fill"
        />
      </header>
      <section className="absolute top-36 left-10 -translate-x-1/2 -translate-y-1/2 border-white border-4 rounded-full overflow-hidden">
        <Image
          src="/hypercerts-logo.png"
          alt="Hypercerts logo"
          width={40}
          height={40}
        />
      </section>
      <section className="pt-5 px-3 pb-3 rounded-t-xl">
        <h5 className="text-xl font-semibold">Planting trees in the world</h5>
        <p className="line-clamp-3 leading-snug tracking-normal pt-1">
          Hypercerts are a way to certify that a project is open source and that
          contributors are being compensated fairly.
        </p>
      </section>
      <footer>
        <div className="flex justify-between items-center p-3 border-t border-gray-200">
          <span className="text-sm text-slate-500 line-clamp-2">
            #opensource #faircompensation #trees #sustainability #environment
          </span>
        </div>
      </footer>
    </article>
  );
};

export { HypercertCard as default };
