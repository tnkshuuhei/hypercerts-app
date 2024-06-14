"use client";

import ConnectDialog from "@/components/connect-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { truncateEthereumAddress } from "@/lib/utils";
import { HypercertMetadata } from "@hypercerts-org/sdk";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Dispatch, Fragment, ReactNode, SetStateAction, useState } from "react";
import { useAccount } from "wagmi";

const EmptySection = () => {
  return (
    <InfoSection>
      <p>Nothing here yet...</p>
    </InfoSection>
  );
};

const InfoSection = ({ children }: { children: ReactNode }) => {
  return (
    <section className="h-40 container mx-auto bg-slate-50 border-slate-300 border-2 p-3 rounded-lg flex flex-col items-center justify-center gap-3">
      {children}
    </section>
  );
};

const profileTabs: {
  tabLabel: string;
  tabKey: "hypercerts" | "hyperboards";
  count: number;
}[] = [
  { tabLabel: "Hypercerts", tabKey: "hypercerts", count: 0 }, // TODO: update count based on data
  { tabLabel: "Hyperboards", tabKey: "hyperboards", count: 0 }, // TODO: update count based on data
];

const Tab = ({
  tabLabel,
  tabKey,
  activeTab,
  setActiveTab,
  count = 0,
}: {
  tabLabel: string;
  activeTab: string;
  tabKey: "hypercerts" | "hyperboards";
  setActiveTab: Dispatch<SetStateAction<"hypercerts" | "hyperboards">>;
  count: number;
}) => {
  const isActive = activeTab === tabKey;

  const badgeActiveClasses = isActive
    ? "bg-black text-white"
    : "text-slate-400 bg-white border-[1.5px] border-slate-300";

  const textActiveClasses = isActive ? "text-primary" : "text-slate-400";

  const buttonActiveClasses = isActive ? "border-primary" : "border-slate-300";

  return (
    <Button
      variant={"outline"}
      className={`space-x-1 ${buttonActiveClasses}`}
      onClick={() => setActiveTab(tabKey)}
    >
      <h2 className={`font-serif text-2xl ${textActiveClasses}`}>{tabLabel}</h2>
      <span
        className={`text-xs ${badgeActiveClasses} px-1 py-0.5 rounded-lg h-max`}
      >
        {count}
      </span>
    </Button>
  );
};

const HypercertsTabContent = ({
  ownedHypercerts,
}: {
  ownedHypercerts: HypercertMetadata[]; // TODO: update type
}) => {
  if (!ownedHypercerts || !ownedHypercerts.length) {
    return <EmptySection />;
  }
  return (
    <div className="flex flex-col gap-2">
      {ownedHypercerts.map((hypercert) => {
        return <div key={hypercert.ref}>{hypercert.name}</div>;
      })}
    </div>
  );
};

const HyperboardsTabContent = ({
  ownedHyperboards,
}: {
  ownedHyperboards: string[]; // TODO: update to hyperboards
}) => {
  if (!ownedHyperboards || !ownedHyperboards.length) {
    return <EmptySection />;
  }
  return <div>Hyperboards</div>;
};

const TabContent = ({
  activeTab,
}: {
  activeTab: "hypercerts" | "hyperboards";
}) => {
  return (
    <section className="py-2">
      {activeTab === "hypercerts" ? (
        <HypercertsTabContent ownedHypercerts={[]} />
      ) : (
        <HyperboardsTabContent ownedHyperboards={[]} />
      )}
    </section>
  );
};

const Profile = () => {
  const { address } = useAccount();
  const { client: hypercertClient } = useHypercertClient();
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"hypercerts" | "hyperboards">(
    "hypercerts"
  );

  const accountFromPath = usePathname().split("/")[2];
  const isAccountProfile =
    address && accountFromPath && address === accountFromPath;

  const getBatchHypercertMetadata = async (hypercertURIs: string[]) =>
    await Promise.allSettled(
      hypercertURIs.map(async (hypercertURI) => {
        return await hypercertClient.indexer.metadataByUri({
          uri: hypercertURI,
        });
      })
    );

  const {
    data: hypercertsByOwnerResponse,
    isLoading: isHypercertsByOwnerLoading,
    error: hypercertsByOwnerError,
  } = useQuery({
    queryKey: ["hypercerts", address],
    queryFn: async () =>
      await hypercertClient.indexer.hypercertsByOwner({
        owner: address,
        first: 10,
      }),
    enabled: !!address && !!activeTab && activeTab === "hypercerts",
  });

  // const {
  //   data: hypercertMetadataResponse,
  //   isLoading: isHypercertMetadataLoading,
  //   error: hypercertMetadataError,
  // } = useQuery({
  //   queryKey: ["hypercerts", address, "owned"],
  //   queryFn: async () =>
  //     await getBatchHypercertMetadata(
  //       hypercertsResponse?.hypercerts?.data?.map(
  //         (hypercert) => hypercert.uri
  //       ) as string[]
  //     ),
  //   enabled: !!address && !!hypercertsResponse?.hypercerts?.data?.length,
  // });

  if (!isAccountProfile) {
    return (
      <InfoSection>
        <h5 className="text-lg font-medium">
          Connect your wallet to view your profile
        </h5>
        <ConnectDialog isOpen={isConnectOpen} setIsOpen={setIsConnectOpen} />
      </InfoSection>
    );
  }

  if (isHypercertsByOwnerLoading) {
    return (
      <InfoSection>
        <div>Loading...</div>
      </InfoSection>
    );
  }

  console.log({ hypercertsByOwnerResponse });

  if (hypercertsByOwnerError) {
    return (
      <InfoSection>
        <div>Error loading hypercerts...</div>
      </InfoSection>
    );
  }

  if (!hypercertsByOwnerResponse) {
    return <InfoSection>No hypercerts found...</InfoSection>;
  }

  // if (isHypercertMetadataLoading) {
  //   return (
  //     <InfoSection>
  //       <div>Getting hypercert metadata...</div>
  //     </InfoSection>
  //   );
  // }

  // if (hypercertMetadataError || !hypercertMetadataResponse) {
  //   return (
  //     <InfoSection>
  //       <div>Sorry, we couldn&apos;t load your hypercerts</div>
  //     </InfoSection>
  //   );
  // }

  // if (!hypercertMetadataResponse) {
  //   if (!hypercertsResponse?.hypercerts?.data?.length) {
  //     return <InfoSection>No hypercerts found</InfoSection>;
  //   }
  //   return <InfoSection>Loading hypercerts...</InfoSection>;
  // }

  // const ownedHypercerts = hypercertMetadataResponse.map((response) => {
  //   if (response.status === "fulfilled" && response.value) {
  //     return response.value.metadata.data;
  //   }
  // });

  // console.log({ ownedHypercerts });

  return (
    <Fragment>
      <section className="flex space-x-2 items-center">
        <h1 className="font-serif text-4xl lg:text-5xl tracking-tight">
          Profile
        </h1>
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 w-max rounded-lg h-max">
          <div className="h-2 w-2 bg-green-400 rounded-full"></div>
          {address && (
            <p className="text-xs">
              Connected as {truncateEthereumAddress(address)}
            </p>
          )}
        </div>
      </section>
      <Separator className="my-4" />
      <section className="flex space-x-2">
        {profileTabs.map((tab) => (
          <Tab
            {...tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            key={tab.tabKey}
          />
        ))}
      </section>
      <TabContent activeTab={activeTab} />
      {/* <section className="space-y-2 pt-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-tight">
            My hypercerts
          </h1>
          <hr className="border-t border-gray-300 my-4" />
          {ownedHypercerts && ownedHypercerts.length > 0 ? (
            <div className="flex flex-row flex-wrap gap-5 justify-center md:justify-start">
              {ownedHypercerts.map((hypercert) => {
                const props: HypercertMiniDisplayProps = {
                  // hypercertId: hypercert.hypercert_id as string,
                  name: hypercert?.name as string,
                  chainId: Number(hypercert?.contract?.chain_id),
                };
                return (
                  <HypercertMiniDisplay
                    {...props}
                    key={hypercert.hypercert_id}
                  />
                );
              })}
            </div>
          ) : (
            <EmptySection />
          )}
        </div>
      </section> */}
    </Fragment>
  );
};

export { Profile as default };
