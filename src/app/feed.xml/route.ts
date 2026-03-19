import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();

  const feed = new Feed({
    title: siteConfig.title,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: "en",
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author}`,
    author: {
      name: siteConfig.author,
      email: siteConfig.email,
      link: siteConfig.url,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.url}/posts/${post.slug}`,
      link: `${siteConfig.url}/posts/${post.slug}`,
      description: post.excerpt,
      date: new Date(post.date),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
