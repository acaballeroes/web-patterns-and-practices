"use client";

import { SidebarInset, SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { AppSidebar } from "@/components/app-sidebar";

export function Shell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { state } = useSidebar();

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 z-20 bg-background">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {state === "collapsed" && (
            <h1 className="text-lg font-semibold">Dev Patterns & Practices</h1>
          )}
        </header>
        <main>
          <section>{children}</section>

          <section
            id="about"
            className="mx-auto max-w-3xl border-t border-border px-6 py-16 md:px-8 lg:px-12"
          >
            <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
              About
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Dev Patterns & Practices is a space for long-form thinking on
              design, technology, and craft. Every piece is written with care
              and the belief that the best ideas deserve room to breathe.
            </p>
          </section>

          <footer className="border-t border-border px-6 py-8 md:px-8 lg:px-12">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {"Dev Patterns & Practices, 2026"}
              </span>
              <div className="flex items-center gap-6">
                {/* <a
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub
                </a>
                <a
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  RSS
                </a> */}
              </div>
            </div>
          </footer>
        </main>
      </SidebarInset>
    </>
  );
}

// export function BlogContent() {
//   const { state } = useSidebar();

//   return (
//     <>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 z-20 bg-background">
//           <SidebarTrigger className="-ml-1" />
//           <Separator
//             orientation="vertical"
//             className="mr-2 data-[orientation=vertical]:h-4"
//           />
//           {state === "collapsed" && (
//             <h1 className="text-lg font-semibold">Dev Patterns & Practices</h1>
//           )}
//         </header>
//         <main>

//           <section
//             id="articles"
//             className="mx-auto max-w-3xl px-6 py-12 md:px-8 lg:px-12"
//           >
//             <div className="mb-8 flex items-center justify-between">
//               <div>
//                 <h2 className="font-serif text-2xl font-semibold text-foreground">
//                   {activeCategory === "All"
//                     ? "Latest Articles"
//                     : activeCategory}
//                 </h2>
//                 <p className="mt-1 text-sm text-muted-foreground">
//                   {filteredPosts.length}{" "}
//                   {filteredPosts.length === 1 ? "article" : "articles"}
//                 </p>
//               </div>
//             </div>

//             <div className="divide-y divide-border">
//               {filteredPosts.map((post) => (
//                 <PostCard key={post.slug} post={post} />
//               ))}
//             </div>

//             {filteredPosts.length === 0 && (
//               <div className="py-20 text-center">
//                 <p className="text-muted-foreground">
//                   No articles found in this category.
//                 </p>
//               </div>
//             )}
//           </section>
//         </main>
//       </SidebarInset>
//     </>
//   );
// }
