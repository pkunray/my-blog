"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

interface Post {
  slug: string;
  title: string;
  date: string;
}

interface TerminalLine {
  type: "input" | "output";
  content: string;
}

const COMMANDS = ["help", "ls", "cat", "grep", "about", "whoami", "clear"];

const WELCOME = [
  'Welcome to the blog terminal. Type "help" for available commands.',
];

export function Terminal({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [lines, setLines] = useState<TerminalLine[]>(
    WELCOME.map((c) => ({ type: "output", content: c }))
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  function execute(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    let output: string[] = [];

    switch (command) {
      case "help":
        output = [
          "Available commands:",
          "  ls              List all posts",
          "  cat <slug>      Open a post",
          "  grep <keyword>  Search posts by keyword",
          "  about           About the author",
          "  whoami          Who is this?",
          "  clear           Clear the terminal",
          "  help            Show this message",
        ];
        break;

      case "ls":
        if (posts.length === 0) {
          output = ["No posts yet."];
        } else {
          output = posts.map((p) => `  ${p.date}  ${p.slug}`);
        }
        break;

      case "cat": {
        const slug = parts[1];
        if (!slug) {
          output = ["Usage: cat <post-slug>"];
        } else {
          const cleanSlug = slug.replace(/\.md$/, "");
          const post = posts.find((p) => p.slug === cleanSlug);
          if (post) {
            output = [`Opening "${post.title}"...`];
            setTimeout(() => router.push(`/posts/${post.slug}`), 400);
          } else {
            output = [`cat: ${slug}: No such file or directory`];
          }
        }
        break;
      }

      case "grep": {
        const keyword = parts.slice(1).join(" ").toLowerCase();
        if (!keyword) {
          output = ["Usage: grep <keyword>"];
        } else {
          const matches = posts.filter(
            (p) =>
              p.title.toLowerCase().includes(keyword) ||
              p.slug.toLowerCase().includes(keyword)
          );
          if (matches.length === 0) {
            output = [`No posts matching "${keyword}".`];
          } else {
            output = [
              `Found ${matches.length} result${matches.length > 1 ? "s" : ""}:`,
              ...matches.map((p) => `  ${p.date}  ${p.slug}  "${p.title}"`),
            ];
          }
        }
        break;
      }

      case "about":
        output = ["Scrolling to about section..."];
        setTimeout(() => {
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 200);
        break;

      case "whoami":
        output = [
          "A developer with 10 years of experience, finally blogging.",
        ];
        break;

      case "clear":
        setLines([]);
        return;

      default:
        output = [
          `command not found: ${command}`,
          'Type "help" for available commands.',
        ];
    }

    setLines((prev) => [
      ...prev,
      { type: "input", content: `$ ${cmd}` },
      ...output.map((o) => ({ type: "output" as const, content: o })),
    ]);
  }

  function tabComplete(current: string) {
    const trimmed = current.trimStart();
    const parts = trimmed.split(/\s+/);

    if (parts.length <= 1) {
      const prefix = parts[0].toLowerCase();
      const matches = COMMANDS.filter((c) => c.startsWith(prefix));
      if (matches.length === 1) return matches[0] + " ";
      return current;
    }

    if (parts[0].toLowerCase() === "cat" && parts.length === 2) {
      const prefix = parts[1].toLowerCase().replace(/\.md$/, "");
      const matches = posts.filter((p) => p.slug.startsWith(prefix));
      if (matches.length === 1) return `cat ${matches[0].slug}`;
      return current;
    }

    return current;
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      setInput(tabComplete(input));
    } else if (e.key === "Enter") {
      execute(input);
      if (input.trim()) {
        setHistory((prev) => [input, ...prev]);
      }
      setHistoryIndex(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const idx = historyIndex + 1;
        setHistoryIndex(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const idx = historyIndex - 1;
        setHistoryIndex(idx);
        setInput(history[idx]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  }

  return (
    <div
      className="w-full rounded-lg overflow-hidden bg-[#1e1e1e] border border-neutral-700 shadow-lg cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#2d2d2d] select-none">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-neutral-500 font-mono">
          ~/blog
        </span>
      </div>

      <div
        ref={scrollRef}
        className="p-4 h-56 overflow-y-auto font-mono text-sm leading-relaxed"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "input" ? "text-[#98c379]" : "text-[#abb2bf]"
            }
          >
            <pre className="whitespace-pre-wrap font-mono m-0">
              {line.content}
            </pre>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-[#98c379]">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#abb2bf] outline-none caret-[#528bff] font-mono text-sm ml-1"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
