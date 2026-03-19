import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/config";
import { Terminal } from "@/components/Terminal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      {/* Header */}
      <header className="mb-16 text-center">
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          {siteConfig.title}
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 italic">
          {siteConfig.description}
        </p>
      </header>

      {/* Terminal */}
      <section className="mb-20">
        <Terminal
          posts={posts.map((p) => ({
            slug: p.slug,
            title: p.title,
            date: p.date,
          }))}
        />
      </section>

      {/* Posts */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400 italic">
            No posts yet. Stay tuned.
          </p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <time
                  dateTime={post.date}
                  className="text-sm text-neutral-400 dark:text-neutral-500 font-mono shrink-0"
                >
                  {formatDate(post.date)}
                </time>
                <Link
                  href={`/posts/${post.slug}`}
                  className="underline underline-offset-3 decoration-neutral-300 dark:decoration-neutral-600 hover:decoration-neutral-800 dark:hover:decoration-neutral-300 transition-colors"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* About */}
      <section id="about" className="mb-20">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>
            I&apos;m a software developer with 10 years of experience. After a
            decade of building software — debugging production issues at 3am,
            making architectural decisions I&apos;d later regret (and some
            I&apos;m proud of), and learning something new almost every day — I
            finally decided to start writing about it.
          </p>
          <p>
            This blog is where I share what I&apos;ve learned, what I&apos;m
            exploring, and the occasional opinion nobody asked for.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400 dark:text-neutral-500">
        <div className="flex gap-5">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            Email
          </a>
          <a
            href="/feed.xml"
            className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            RSS
          </a>
        </div>
        <span>
          &copy; {new Date().getFullYear()} {siteConfig.author}
        </span>
      </footer>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
