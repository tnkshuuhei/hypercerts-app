"use client";

import { useAccount } from "wagmi";

const Profile = () => {
  const { address } = useAccount();

  if (!address) {
    return <div>Please connect your wallet to view this page</div>;
  }

  return (
    <main className="flex flex-col p-8 md:p-24 pb-24">
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
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p>Hypercert</p>
            <p>Issuer</p>
          </div>
        </section>
      </section>
      <section className="space-y-2">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-tight">
            My hyperboards
          </h1>
          <hr className="border-t border-gray-300 my-4" />
        </div>
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p>Hypercert</p>
            <p>Issuer</p>
          </div>
        </section>
      </section>
    </main>
  );
};

export { Profile as default };
