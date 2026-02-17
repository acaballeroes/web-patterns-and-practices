import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <Banner />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-4">DevPatterns & Practices</h1>
        <h2 className="text-xl font-semibold mb-2">
          Welcome to Your Guide for Engineering Excellence
        </h2>
        <p className="mb-6">
          Welcome to the this playbook! This document serves as a comprehensive
          guide to building high-quality, maintainable, and scalable software
          within our development team.
        </p>
        <Separator className="my-6" />
        <section>
          <h3 className="text-2xl font-bold mb-2">Purpose and Goals</h3>
          <h4 className="text-lg font-semibold mb-2">
            Why This Playbook Exists
          </h4>
          <p className="mb-4">
            In modern software development, consistency and quality aren&apos;t
            just nice-to-have — they&apos;re essential for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Maintainability: Code that&apos;s easy to understand and modify
              years later
            </li>
            <li>
              Collaboration: Team members working seamlessly across projects
            </li>
            <li>Onboarding: New developers becoming productive quickly</li>
            <li>Quality: Fewer bugs, better performance, and happier users</li>
            <li>
              Knowledge Sharing: Preserving team wisdom and avoiding repeated
              mistakes
            </li>
          </ul>
          <h4 className="text-lg font-semibold mb-2">What You will Achieve</h4>
          <p className="mb-4">By following this playbook, you will:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Write code that meets professional industry standards</li>
            <li>
              Collaborate effectively with team members using shared conventions
            </li>
            <li>
              Deliver features faster with battle-tested patterns and practices
            </li>
            <li>Build software that is easier to test, debug, and maintain</li>
            <li>Make architectural decisions with confidence</li>
            <li>Contribute to a culture of continuous improvement</li>
          </ul>
        </section>
      </div>
    </>
  );
}
