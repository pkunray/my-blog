import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/config";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${siteConfig.url}/posts/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <header className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors font-mono"
          >
            &larr; back
          </Link>
          <ThemeToggle />
        </div>
        <time
          dateTime={post.date}
          className="text-sm text-neutral-400 dark:text-neutral-500 font-mono"
        >
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
          {post.title}
        </h1>
      </header>

      <article
        className="prose dark:prose-invert prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
      />

      <footer className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href="/"
          className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors font-mono"
        >
          &larr; back to all posts
        </Link>
      </footer>
    </div>
  );
}
