import { BuildingForTheWebPost } from "@/components/posts/building-for-the-web";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building for the Web in 2026 - Dev Patterns & Practices",
  description:
    "The web platform has evolved dramatically. Here is what matters now and what you can safely ignore.",
};

export default function Page() {
  return <BuildingForTheWebPost />;
}
