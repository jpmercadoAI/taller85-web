"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/construccion", label: "Construcción" },
  { href: "/espacios", label: "Espacios" },
  { href: "/manufactura", label: "Manufactura" },
  { href: "/branding", label: "Branding" },
  { href: "/media", label: "Media" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="w-full border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logos/logo-taller85-v2.png"
              alt="Taller 85"
              width={60}
              height={60}
              priority
            />
            <span className="text-xl font-semibold text-[color:var(--brand)]">
              Taller 85
            </span>
          </Link>

          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition font-medium ${isActive
                      ? "border-b-2 pb-1"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                  style={
                    isActive
                      ? { color: "var(--brand)", borderColor: "var(--brand)" }
                      : {}
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="rounded-lg border border-black/10 px-3 py-2 text-sm md:hidden"
            onClick={() => setOpen(true)}
          >
            Menú
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-base font-semibold text-[color:var(--brand)]">
                Menú
              </span>

              <button
                type="button"
                className="rounded-lg border border-black/10 px-3 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                Cerrar
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-base text-slate-700">
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition font-medium ${isActive
                      ? "border-b-2 pb-1"
                      : "text-slate-600 hover:text-slate-900"
                      }`}
                    style={
                      isActive
                        ? { color: "var(--brand)", borderColor: "var(--brand)" }
                        : {}
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}