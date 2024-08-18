import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your hypercerts and hyperboards",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col p-8 md:px-24 pt-8 pb-24 space-y-4 flex-1 container max-w-screen-2xl">
      {children}
    </main>
  );
}
