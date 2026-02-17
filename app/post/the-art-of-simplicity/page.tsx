import { ArtOfSimplicityPost } from "@/components/posts/art-of-simplicity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Art of Simplicity in Modern Design - Dev Patterns & Practices",
  description:
    "Exploring how restraint and intentionality create more impactful experiences. Less is not just more, it is everything.",
};

export default function Page() {
  return <ArtOfSimplicityPost />;
}
