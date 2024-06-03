import HypercertCard, {
  type HypercertCardProps,
} from "@/components/hypercert-card";

export const metadata = {
  title: "Explore",
  description:
    "The best place to discover and contribute to hypercerts and hyperboards.",
};

const cardData: HypercertCardProps[] = [
  {
    title: "Moslev's Supreme Treasure Hunt",
    description:
      "A treasure hunt to find the hidden treasure in the hypercerts.",
    hypercertId: "0x12234",
    banner:
      "https://www.kathrynwilking.com/wp-content/uploads/2018/03/Treasure-Box-blog-iStock-542285574.jpg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Treasure_logo_2023.png",
  },
  {
    title: "Global Reforestation Initiative",
    description:
      "Join efforts to plant trees worldwide and combat deforestation.",
    hypercertId: "0x334455",
    banner: "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/The_logo_of_the_two_swords_and_the_palm_tree.jpg",
  },
  {
    title: "Ocean Cleanup Project",
    description: "Help remove plastics and other waste from our oceans.",
    hypercertId: "0x556677",
    banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Nick_Mason_DW_%22Waves%22_Kit_2022.jpg",
  },
  {
    title: "Renewable Energy Research",
    description:
      "Support advancements in sustainable and renewable energy sources.",
    hypercertId: "0x778899",
    banner: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Cristian_Sun_Logo_Transparente.png",
  },
  {
    title: "Wildlife Conservation Network",
    description:
      "Contribute to the protection of endangered species and their habitats.",
    hypercertId: "0x9900aa",
    banner: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Logo_du_groupe_wolf_pack.jpg",
  },
  {
    title: "Clean Air Initiative",
    description:
      "Promote projects that aim to reduce air pollution in urban areas.",
    hypercertId: "0xbbccdd",
    banner: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/Wind_logo_2017.svg",
  },
];

export default function Explore() {
  return (
    <>
      <main className="flex flex-col p-8 md:p-24 pb-24">
        <section>
          <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
            Explore
          </h1>
          <div className="p-1"></div>
          <p className="md:text-lg">
            The best place to discover and contribute to hypercerts and
            hyperboards.
          </p>
        </section>

        <div className="p-3"></div>
        <div className="flex flex-wrap gap-5">
          {cardData.map((card) => (
            <article
              key={card.hypercertId}
              className="w-[280px] h-[250px] p-3 bg-slate-100 rounded-xl relative"
            >
              <HypercertCard {...card} key={card.hypercertId} />
              <p>{card.title}</p>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
