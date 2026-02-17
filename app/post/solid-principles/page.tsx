import { PostCard } from "@/components/post-card";
import { PostLayout } from "@/components/post-layout";
import { getPostBySlug, getArticlesByPost } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solid Principles - Dev Patterns & Practices",
  description:
    "In-depth guide covering each SOLID principle with conceptual explanations and working examples in C# and TypeScript that make it easier to write testable, scalable code.",
};

export default function Page() {
  const post = getPostBySlug("solid-principles");

  if (!post) {
    return <div></div>;
  }

  const articles = getArticlesByPost(post.slug);

  return (
    <PostLayout
      title={post.title}
      date={post.date}
      category={post.category}
      excerpt={post.excerpt}
    >
      <div className="space-y-8 text-base leading-relaxed text-foreground/80">
        <p>
          This guide unpacks the SOLID principles one by one so that each
          concept stops feeling like abstraction and becomes a concrete
          technique you can apply today. You will see mental models,
          anti-patterns, and an evolving story that starts with a single
          responsibility and ends with a dependency graph that prefers
          interfaces over implementations.
        </p>
        <p>
          SOLID is an acronym coined by Robert C. Martin (Uncle Bob) that
          captures five design principles for writing maintainable, scalable,
          and testable code. Whether you are building a C# backend or a
          TypeScript frontend, these ideas map onto the same core truths: keep
          modules small, respect contracts, and depend on abstractions, not
          concrete details.
        </p>

        {/* Single Responsibility Principle */}
        <div className="rounded-lg border-l-4 border-l-blue-500 border border-border bg-blue-50/30 p-5 dark:bg-blue-950/20">
          <h3 className="font-semibold text-lg text-foreground">
            1. Single Responsibility Principle (SRP)
          </h3>
          <p className="mt-2 text-sm">
            <span className="font-medium">Core Idea:</span> A class or module
            should have one and only one reason to change. If you find yourself
            listing more than one responsibility, you have already violated it.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Why It Matters:</span> When a class
            handles multiple concerns—say, both parsing user input and sending
            emails—then a change to the email logic forces you to re-test the
            parsing. You become trapped in a web of side effects. Splitting
            responsibilities isolates risk and makes testing simpler.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">In Practice:</span> Instead of a
            UserService that does everything, create a UserValidator, a
            UserRepository, and an EmailNotifier. Each class has a single reason
            to change: validator changes if rules change, repository if the
            database schema changes, notifier if the email template changes.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Warning Signs:</span> Class names like
            &ldquo;Manager,&rdquo; &ldquo;Service,&rdquo; or
            &ldquo;Handler&rdquo; that hint at multiple jobs; test files that
            cover wildly different behaviors in one setup; methods with names
            like &ldquo;ProcessEverything&rdquo; or &ldquo;DoAll.&rdquo;
          </p>
        </div>

        {/* Open/Closed Principle */}
        <div className="rounded-lg border-l-4 border-l-emerald-500 border border-border bg-emerald-50/30 p-5 dark:bg-emerald-950/20">
          <h3 className="font-semibold text-lg text-foreground">
            2. Open/Closed Principle (OCP)
          </h3>
          <p className="mt-2 text-sm">
            <span className="font-medium">Core Idea:</span> A class should be
            open for extension but closed for modification. New behavior should
            arrive through inheritance, composition, or interfaces—not by
            rewriting existing code.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Why It Matters:</span> Every time you
            crack open a working class to add a feature, you risk introducing
            bugs and invalidating tests. By designing for extension, new
            features land in new code, leaving proven logic untouched. The code
            becomes more resilient because the original behavior is insulated.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">In Practice:</span> Instead of
            modifying a Logger class to support multiple output formats, create
            an abstract Logger base class and derive FileLogger, ConsoleLogger,
            and CloudLogger from it. Each subclass adds behavior without
            touching the original. In TypeScript, use interfaces and strategy
            patterns to swap implementations.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Warning Signs:</span> Large if-else
            chains that check types or string enums; comments saying
            &ldquo;TODO: refactor this for the next feature&rdquo;;
            modifications to old code every sprint.
          </p>
        </div>

        {/* Liskov Substitution Principle */}
        <div className="rounded-lg border-l-4 border-l-amber-500 border border-border bg-amber-50/30 p-5 dark:bg-amber-950/20">
          <h3 className="font-semibold text-lg text-foreground">
            3. Liskov Substitution Principle (LSP)
          </h3>
          <p className="mt-2 text-sm">
            <span className="font-medium">Core Idea:</span> Objects of a derived
            class should be able to replace objects of a base class without
            breaking the application. If a subclass promises to be a Bird, it
            must honor all bird contracts—it cannot silently refuse to fly.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Why It Matters:</span> Liskov ensures
            that inheritance hierarchies remain predictable and safe. If your
            code treats objects as instances of their base type, swapping a
            derived type should never cause surprises. This is what makes
            polymorphism reliable.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">In Practice:</span> A Rectangle class
            has a SetWidth and SetHeight method. A Square, which logically is a
            rectangle, might try to keep its sides equal. But then setting width
            without setting height violates the Square&apos;s contract—calling
            code expects both to be independent. Liskov says: if Square inherits
            from Rectangle, it must fulfill all Rectangle promises without
            surprise behavior.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Warning Signs:</span> Derived classes
            that throw &ldquo;NotImplementedException&rdquo;; subclasses that
            silently ignore method calls; conditional checks like `if (obj
            instanceof SpecificType)` scattered through your logic.
          </p>
        </div>

        {/* Interface Segregation Principle */}
        <div className="rounded-lg border-l-4 border-l-rose-500 border border-border bg-rose-50/30 p-5 dark:bg-rose-950/20">
          <h3 className="font-semibold text-lg text-foreground">
            4. Interface Segregation Principle (ISP)
          </h3>
          <p className="mt-2 text-sm">
            <span className="font-medium">Core Idea:</span> Clients should never
            be forced to depend on interfaces they do not use. If a class only
            needs one method, do not make it implement a fat interface with ten
            methods.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Why It Matters:</span> Fat interfaces
            create coupling. If a small class depends on a huge interface, it
            becomes coupled to things it does not care about. When the interface
            changes, that small class must change too, even if the change
            affects methods it never calls. Segregating interfaces shrinks the
            surface area.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">In Practice:</span> Instead of one
            massive IDataProvider interface with methods for SQL, file I/O,
            caching, and more, split it into IReader, IWriter, and ICache.
            Classes that only read data depend only on IReader. A change to the
            caching logic does not ripple through reader implementations.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Warning Signs:</span> Interfaces with
            dozens of methods; classes implementing interfaces but leaving most
            methods empty or with placeholder logic; tests that mock huge
            objects just to test a small feature.
          </p>
        </div>

        {/* Dependency Inversion Principle */}
        <div className="rounded-lg border-l-4 border-l-purple-500 border border-border bg-purple-50/30 p-5 dark:bg-purple-950/20">
          <h3 className="font-semibold text-lg text-foreground">
            5. Dependency Inversion Principle (DIP)
          </h3>
          <p className="mt-2 text-sm">
            <span className="font-medium">Core Idea:</span> High-level modules
            should not depend on low-level modules. Both should depend on
            abstractions. Abstractions should not depend on details; details
            should depend on abstractions.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Why It Matters:</span> If your
            business logic directly creates or calls low-level implementations
            (databases, file systems, APIs), you lock your core logic to those
            implementations. Swapping a PostgreSQL database for MongoDB forces
            you to rewrite business logic. Inverting the dependency—so business
            logic depends on an IRepository abstraction—lets you swap
            implementations without touching core code.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">In Practice:</span> Instead of a
            UserService that directly instantiates a SqlUserRepository, inject
            an IUserRepository interface. At runtime, you pass in
            SqlUserRepository or MongoUserRepository. The service does not know
            or care which; it only knows the interface. This is the foundation
            of dependency injection.
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Warning Signs:</span> Use of `new`
            keywords scattered across your business logic; tests that require a
            real database or API to run; high-level code importing low-level
            implementation files.
          </p>
        </div>

        {/* How They Work Together */}
        <div className="rounded-lg border border-border bg-muted p-5">
          <h3 className="font-semibold text-lg text-foreground">
            How They Work Together
          </h3>
          <p className="mt-3 text-sm">
            The five principles are not isolated rules; they reinforce each
            other. SRP keeps classes focused so they are easier to test in
            isolation. OCP ensures that adding behavior does not require
            modifying existing classes—which would violate SRP. LSP makes sure
            derived types are safe to use wherever base types are expected,
            which is essential for OCP to work reliably. ISP prevents
            accidentally forcing a class to violate LSP by making it implement
            more than it should. And DIP ties everything together by ensuring
            that your high-level policies depend only on abstractions, allowing
            low-level details to change without disrupting the core logic.
          </p>
          <p className="mt-3 text-sm">
            When you apply all five, you end up with a codebase that is easier
            to test, less fragile when requirements change, and far more
            pleasant to maintain.
          </p>
        </div>

        {/* What Follows */}
        <div className="rounded-lg border border-border bg-muted p-5">
          <h3 className="font-semibold text-lg text-foreground">
            What Follows
          </h3>
          <p className="mt-3 text-sm">
            Each article in this series takes one principle and walks through it
            in depth. You will see common mistakes, anti-patterns, and concrete
            refactoring examples in both C# and TypeScript. The goal is not to
            memorize rules but to develop an intuition for when your code is
            starting to hurt—and how to fix it before the pain becomes severe.
          </p>
        </div>
      </div>

      <section
        id="articles"
        className="mx-auto max-w-3xl px-6 py-12 md:px-8 lg:px-12"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mt-1 text-sm text-muted-foreground">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        <div className="divide-y divide-border">
          {articles.map((article) => (
            <PostCard key={article.title} article={article} />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              No articles found in this category.
            </p>
          </div>
        )}
      </section>
    </PostLayout>
  );
}
