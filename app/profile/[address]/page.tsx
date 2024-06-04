"use client";

import { truncateEthereumAddress } from "@/lib/utils";
import { useAccount } from "wagmi";

const EmptyProfile = () => {
  return (
    <div>
      <p>Connect your wallet to view your profile</p>
    </div>
  );
};

const EmptySection = () => {
  return (
    <div className="flex items-center justify-center h-40">
      <p>Nothing here yet</p>
    </div>
  );
};

const Profile = () => {
  const { address } = useAccount();

  if (!address) {
    return <EmptyProfile />;
  }

  return (
    <section>
      <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 w-max rounded-lg">
        <div className="h-2 w-2 bg-green-400 rounded-full"></div>
        <p className="text-sm">
          Connected as {truncateEthereumAddress(address)}
        </p>
      </div>
      <div className="p-3" />
      <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
        Profile
      </h1>
      <section className="space-y-2 pt-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-tight">
            My hypercerts
          </h1>
          <hr className="border-t border-gray-300 my-4" />
        </div>
        <EmptySection />
      </section>
      <section className="space-y-2">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-tight">
            My hyperboards
          </h1>
          <hr className="border-t border-gray-300 my-4" />
        </div>
        <EmptySection />
      </section>
    </section>
  );
};

export { Profile as default };
