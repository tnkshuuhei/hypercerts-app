import { HypercertsByCreatorQueryResponse } from "@/app/profile/[address]/queries";
import { EmptySection } from "@/app/profile/[address]/sections";
import HypercertMiniDisplay from "@/components/hypercert/hypercert-mini-display";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import { Dispatch, ReactNode, SetStateAction } from "react";

type ProfileTabKey =
  | "hypercerts:created"
  | "hypercerts:owned"
  | "hyperboards:created"
  | "hyperboards:owned";

type Tab = {
  tabLabel: string;
  tabKey: ProfileTabKey;
};

type ProfileTabDetails = Tab & {
  subTabs: Tab[];
};

type ProfileTabProps = Tab & {
  activeTab: ProfileTabKey;
  setActiveTab: Dispatch<SetStateAction<ProfileTabKey>>;
};

const profileTabs: ProfileTabDetails[] = [
  {
    tabLabel: "Hypercerts",
    tabKey: "hypercerts:created",
    subTabs: [
      { tabLabel: "Created by me", tabKey: "hypercerts:created" },
      { tabLabel: "My contributions", tabKey: "hypercerts:owned" },
    ],
  },
  {
    tabLabel: "Hyperboards",
    tabKey: "hyperboards:created",
    subTabs: [
      { tabLabel: "Created by me", tabKey: "hyperboards:created" },
      { tabLabel: "My contributions", tabKey: "hyperboards:owned" },
    ],
  },
];

const ProfileMainTabButton = ({
  tabLabel,
  tabKey,
  activeTab,
  setActiveTab,
}: ProfileTabProps) => {
  const isActive = activeTab.split(":")[0] === tabKey.split(":")[0];

  const textActiveClasses = isActive ? "text-primary" : "text-slate-400";

  const buttonActiveClasses = isActive ? "border-primary" : "border-slate-300";

  return (
    <Button
      variant={"outline"}
      size={"lg"}
      className={`space-x-1 border-[1.5px] ${buttonActiveClasses}`}
      onClick={() => setActiveTab(tabKey)}
    >
      <h2 className={`font-serif text-xl lg:text-3xl ${textActiveClasses}`}>
        {tabLabel}
      </h2>
    </Button>
  );
};

const ProfileSubTabButton = ({
  tabLabel,
  tabKey,
  activeTab,
  setActiveTab,
  count,
}: ProfileTabProps & { count: number }) => {
  const isActive = activeTab === tabKey;

  const badgeActiveClasses = isActive
    ? "bg-black text-white"
    : "text-slate-400 bg-white border-[1.5px] border-slate-300";

  const textActiveClasses = isActive ? "text-primary" : "text-slate-400";

  const buttonActiveClasses = isActive ? "border-primary" : "border-slate-300";

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size={"sm"}
      className={`space-x-1 ${buttonActiveClasses}`}
      onClick={() => setActiveTab(tabKey)}
    >
      <h2 className={`text-sm ${textActiveClasses}`}>{tabLabel}</h2>
      <span
        className={`text-xs ${badgeActiveClasses} px-1 py-0.5 rounded-lg h-max`}
      >
        {count}
      </span>
    </Button>
  );
};

const HypercertsTabContent = ({
  hypercerts,
}: {
  hypercerts: HypercertsByCreatorQueryResponse["hypercerts"]["data"]; // TODO: update type
}) => {
  if (!hypercerts || !hypercerts.length) {
    return <EmptySection />;
  }
  return (
    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
      {hypercerts.map((hypercert, index) => {
        const props = {
          hypercertId: hypercert.hypercert_id,
          name: hypercert.metadata.name,
          units: hypercert.units,
          uri: hypercert.uri,
          chainId: hypercert.contract.chain_id,
        };
        return <HypercertMiniDisplay key={index} {...props} />; // TODO: show hypercert mini displays
      })}
    </div>
  );
};

const HyperboardsTabContent = ({
  hyperboards,
}: {
  hyperboards: any[]; // TODO: update to hyperboards
}) => {
  if (!hyperboards || hyperboards.length === 0) {
    return <EmptySection />;
  }

  return (
    <div>
      <Script
        src="https://hyperboards-git-feature-hyperboard-widget-hypercerts-foundation.vercel.app/widget/hyperboard-widget.js"
        type="module"
      />
      <div className="flex flex-col gap-4">
        {hyperboards.map((hyperboard) => (
          <div
            key={hyperboard}
            className="hyperboard-widget"
            data-hyperboard-id={hyperboard}
          ></div>
        ))}
      </div>
    </div>
  );
};


// const ProfileTabContent = ({
//   activeTab,
//   data,
// }: {
//   activeTab: "hypercerts" | "hyperboards";
//   data: { hyperboardIds: string[]; ownedHypercerts: HypercertMetadata[] };
// }) => {
//   const tabContent: { [key in ProfileTabKey]: ReactNode } = {
//     hypercerts: <HypercertsTabContent ownedHypercerts={data.ownedHypercerts} />,
//     hyperboards: (
//       <HyperboardsTabContent ownedHyperboards={data.hyperboardIds} />
//     ),
//   };

//   return <section className="py-2">{tabContent[activeTab]}</section>;
// };



const ProfileTabContent = ({
  activeTab,
  data,
}: {
  activeTab: ProfileTabKey;
  data: any[];
}) => {
  const tabContent: { [key in ProfileTabKey]: ReactNode } = {
    "hypercerts:created": <HypercertsTabContent hypercerts={data} />,
    "hypercerts:owned": <HypercertsTabContent hypercerts={data} />,
    "hyperboards:created": <HyperboardsTabContent hyperboards={data} />,
    "hyperboards:owned": <HyperboardsTabContent hyperboards={data} />,
  };

  return <section className="py-2">{tabContent[activeTab]}</section>;
};

const ProfileTabSection = ({
  activeTab,
  setActiveTab,
  data,
}: {
  activeTab: ProfileTabKey;
  setActiveTab: Dispatch<SetStateAction<ProfileTabKey>>;
  data: Record<ProfileTabKey, { data: any[] }>;
}) => {
  const activeTabPrefix = activeTab.split(":")[0];
  return (
    <section className="w-full space-y-2">
      <section className="space-x-1 w-full">
        {profileTabs.map((tab) => (
          <>
            <ProfileMainTabButton
              key={tab.tabKey}
              {...tab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </>
        ))}
      </section>
      <section className="space-x-1">
        {profileTabs
          .find((tab) => tab.tabKey.split(":")[0] === activeTabPrefix)
          ?.subTabs.map((subTab) => (
            <ProfileSubTabButton
              key={subTab.tabKey}
              {...subTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              count={data[subTab.tabKey].data.length}
            />
          ))}
      </section>
    </section>
  );
};

export {
  ProfileTabContent,
  ProfileTabSection,
  profileTabs,
  type ProfileTabKey,
};
