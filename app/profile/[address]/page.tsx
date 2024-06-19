"use client";

import getHypercertsByCreatorQuery from "@/app/profile/[address]/queries";
import { InfoSection } from "@/app/profile/[address]/sections";
import {
  ProfileTabContent,
  ProfileTabSection,
  type ProfileTabKey,
} from "@/app/profile/[address]/tabs";
import EthAddress from "@/components/eth-address";
import { Separator } from "@/components/ui/separator";
import { supabaseData } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";

const Profile = ({ params }: { params: { address: string } }) => {
  const [activeTab, setActiveTab] =
    useState<ProfileTabKey>("hypercerts:created");

  const address = params.address;
  const {
    data: hypercertsByCreatorResponse,
    isLoading: isHypercertsByCreatorLoading,
    error: hypercertsByCreatorError,
  } = useQuery({
    queryKey: ["hypercerts", address, "created"],
    queryFn: () => getHypercertsByCreatorQuery(address as string),
    enabled: !!address && activeTab === "hypercerts:created",
  });

  const {
    data: hyperboardsByOwnerResponse,
    isLoading: isHyperboardsByOwnerLoading,
    error: hyperboardsByOwnerError,
  } = useQuery({
    queryKey: ["hyperboards", address],
    queryFn: async () => {
      return await supabaseData
        .from("hyperboards")
        .select("id")
        .eq("admin_id", address!.toLowerCase());
    },
    enabled: !!address,
  });

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

  if (isHyperboardsByOwnerLoading) {
    return <InfoSection>Loading hyperboards...</InfoSection>;
  }

  if (!hyperboardsByOwnerResponse?.data) {
    return <InfoSection>No hyperboards found...</InfoSection>;
  }

  const createdHypercerts = hypercertsByCreatorResponse.hypercerts.data || [];
  const ownedHyperboards = hyperboardsByOwnerResponse?.data || [];

  const tabData: Record<ProfileTabKey, { data: any[] }> = {
    "hypercerts:created": {
      data: createdHypercerts,
    },
    "hyperboards:owned": {
      data: ownedHyperboards,
    },
  };

  return (
    <Fragment>
      <section className="flex flex-wrap gap-2 items-center">
        <h1 className="font-serif text-2xl lg:text-3xl tracking-tight">
          Profile
        </h1>
        <EthAddress address={address} />
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
