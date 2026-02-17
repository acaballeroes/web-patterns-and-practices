"use client";

import Image from "next/image";
export function Banner() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/banner-dev-patterns-and-practices-image.png"
          alt=""
          width={1000}
          height={600}
          className="h-full w-full object-cover"
          role="presentation"
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      {/* Content */}
      <div className="relative flex h-100 flex-col items-center justify-end px-6 py-6 text-center">
        <h1 className="mb-3 font-serif text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Dev Patterns & Practices
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-primary-foreground/80 md:text-base">
          Where good practices become habit.
        </p>
      </div>
    </div>
  );
}
