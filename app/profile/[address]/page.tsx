"use client";

import getHypercertsByCreatorQuery from "@/app/profile/[address]/queries";
import { InfoSection } from "@/app/profile/[address]/sections";
import {
  ProfileTabContent,
  ProfileTabSection,
  type ProfileTabKey,
} from "@/app/profile/[address]/tabs";
import ConnectDialog from "@/components/connect-dialog";
import { Separator } from "@/components/ui/separator";
import { truncateEthereumAddress } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import { useAccount } from "wagmi";

const Profile = () => {
  const { address } = useAccount();
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const [activeTab, setActiveTab] =
    useState<ProfileTabKey>("hypercerts:created");

  const accountFromRoutePath = usePathname().split("/")[2];
  const isAccountProfile =
    address && accountFromRoutePath && address === accountFromRoutePath;

  const {
    data: hypercertsByCreatorResponse,
    isLoading: isHypercertsByCreatorLoading,
    error: hypercertsByCreatorError,
  } = useQuery({
    queryKey: ["hypercerts", address, "created"],
    queryFn: () => getHypercertsByCreatorQuery(address as string),
    enabled: !!address && activeTab === "hypercerts:created",
  });

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

  if (isHypercertsByCreatorLoading) {
    return (
      <InfoSection>
        <div>Loading...</div>
      </InfoSection>
    );
  }

  if (hypercertsByCreatorError) {
    return (
      <InfoSection>
        <div>Error loading hypercerts...</div>
      </InfoSection>
    );
  }

  if (!hypercertsByCreatorResponse) {
    return <InfoSection>No hypercerts found...</InfoSection>;
  }

  const createdHypercerts = hypercertsByCreatorResponse.hypercerts.data || [];

  const tabData: Record<ProfileTabKey, { data: any[] }> = {
    "hypercerts:created": {
      data: createdHypercerts,
    },
    "hypercerts:owned": {
      data: [],
    },
    "hyperboards:created": {
      data: [],
    },
    "hyperboards:owned": {
      data: [],
    },
  };

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
        <ProfileTabSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={tabData}
        />
      </section>
      <ProfileTabContent activeTab={activeTab} data={tabData[activeTab].data} />
    </Fragment>
  );
};

export { Profile as default };
