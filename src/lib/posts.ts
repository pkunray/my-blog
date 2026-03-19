import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface PostWithContent extends Post {
  content: string;
  htmlContent: string;
}

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDirectory);
  return files
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || "",
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export async function getPostBySlug(
  slug: string
): Promise<PostWithContent> {
  let fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.mdx`);
  }
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  const htmlContent = await markdownToHtml(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt || "",
    content,
    htmlContent,
  };
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, { theme: "one-dark-pro" })
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}
