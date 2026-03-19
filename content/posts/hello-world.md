---
title: "Hello World: How This Blog Is Built"
date: "2026-03-18"
excerpt: "A look under the hood at the tech stack powering this blog — and why I chose simplicity over everything else."
---

Every developer's blog needs a "how I built this" post. It's tradition. So here's mine.

## The stack

This blog is intentionally simple:

- **Next.js** — React framework with static site generation
- **Tailwind CSS** — utility-first styling
- **Markdown** — posts are `.md` files in a Git repo
- **Cloudflare Pages** — free hosting, no restrictions

That's it. No CMS, no database, no authentication, no unnecessary complexity.

## Why static?

A blog is read-heavy and write-rare. I publish a post maybe once or twice a month. There's no reason to spin up a server, manage a database, or pay for hosting.

With static generation, every page is pre-rendered at build time:

```typescript
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

The result is a folder of HTML files that loads instantly from a CDN. No cold starts, no loading spinners, no server to maintain.

## Why Markdown?

Markdown is the best format for developer writing:

1. **It's portable** — not locked into any platform
2. **It's version-controlled** — every edit is a Git commit
3. **It's readable** — even the raw source is pleasant to read
4. **It supports code** — first-class syntax highlighting

```python
# Markdown just works for code examples
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

## The terminal widget

You might have noticed the interactive terminal on the home page. It's a small React component that simulates a Unix shell. You can type `ls` to list posts, `cat <slug>` to open one, or `about` to learn more about me.

It's a fun touch that says "this is a developer's blog" without being obnoxious about it.

## What's next

I'll keep the blog simple and focus on what matters: the writing. If you want to build something similar, the source code is on GitHub. Fork it, make it yours.
