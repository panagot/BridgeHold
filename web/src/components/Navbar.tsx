"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/examples", label: "Examples" },
  { href: "/demo", label: "Live demo" },
  { href: "/simulator", label: "Simulator" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b12]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 text-sm font-bold text-black shadow-[0_0_20px_-4px_rgba(34,211,238,0.7)]">
            B
          </span>
          <span className="hidden sm:inline">
            Bridge<span className="text-cyan-400">Hold</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm sm:gap-2">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-2 py-1.5 transition-colors sm:px-3 ${
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href="https://platform.torque.so/docs/mcp/quickstart"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 rounded-lg bg-teal-600 px-3 py-1.5 font-semibold text-white shadow-sm transition-colors hover:bg-teal-500"
          >
            Torque docs
          </a>
        </nav>
      </div>
    </header>
  );
}
