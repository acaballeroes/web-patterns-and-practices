"use client";

import Image from "next/image";

interface HeroBannerProps {
  scrollY: number;
}

export function HeroBanner({ scrollY }: HeroBannerProps) {
  const maxScroll = 300;
  const progress = Math.min(scrollY / maxScroll, 1);

  const bannerHeight = 420 - progress * 280;
  const opacity = 1 - progress * 0.6;
  const textScale = 1 - progress * 0.3;
  const imageScale = 1 + progress * 0.1;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: `${bannerHeight}px` }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${imageScale})`,
          transition: "transform 0.1s linear",
        }}
      >
        <Image
          src="/images/blog-banner.jpg"
          alt=""
          width={800}
          height={200}
          className="h-full w-full object-cover"
          role="presentation"
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      {/* Content */}
      <div
        className="relative flex h-full flex-col items-center justify-center px-6 text-center"
        style={{
          opacity,
          transform: `scale(${textScale})`,
          transition: "opacity 0.1s linear, transform 0.1s linear",
        }}
      >
        <h1 className="mb-3 font-serif text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Dev Patterns & Practices
        </h1>
        <p
          className="max-w-lg text-sm leading-relaxed text-primary-foreground/80 md:text-base"
          style={{
            opacity: 1 - progress * 1.5,
          }}
        >
          Where good practices become habit.
        </p>
      </div>
    </div>
  );
}
