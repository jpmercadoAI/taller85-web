"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { id: "construccion", label: "Construcción", route: "/construccion" },
  { id: "espacios", label: "Espacios", route: "/espacios" },
  { id: "manufactura", label: "Manufactura", route: "/manufactura" },
  { id: "branding", label: "Branding", route: "/branding" },
  { id: "media", label: "Media", route: "/media" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["construccion", "espacios", "manufactura", "branding", "media"];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);
  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="flex w-full items-center justify-between px-6 py-4 md:px-10 lg:px-16">
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
              const isActive = pathname === "/"
                ? activeSection === link.id
                : pathname === link.route;

              return (
                <Link
                  key={link.route}
                  href={pathname === "/" ? `#${link.id}` : link.route}
                  className={`relative font-medium transition ${isActive
                    ? "text-[color:var(--brand)]"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                  style={
                    isActive
                      ? { color: "var(--brand)", borderColor: "var(--brand)" }
                      : {}
                  }
                >
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full transition-all duration-500 ${isActive ? "bg-[color:var(--brand)]" : "bg-transparent"
                      }`}
                  />
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
                const isActive = pathname === link.route;

                return (
                  <Link
                    key={link.route}
                    href={link.route}
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