import Image from "next/image";

export default async function HypercertImage({
  hypercertId,
  name,
}: {
  hypercertId: string;
  name: string;
}) {
  return (
    <div className="h-[300px] lg:h-[350px] min-w-[300px] lg:min-w-[500px] max-w-[500px] flex flex-col">
      <div className="relative w-full flex-grow bg-accent border border-slate-300 rounded-lg overflow-hidden">
        <Image
          src={`/api/hypercerts/${hypercertId}/image`}
          alt={name || ""}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain object-top p-2"
        />
      </div>
    </div>
  );
}
