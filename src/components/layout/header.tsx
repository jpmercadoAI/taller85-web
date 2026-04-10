"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const links = [
  { id: "construccion", label: "Construcción", route: "/construccion" },
  { id: "espacios", label: "Espacios", route: "/espacios" },
  { id: "manufactura", label: "Manufactura", route: "/manufactura" },
  { id: "branding", label: "Branding", route: "/branding" },
  { id: "media", label: "Media", route: "/media" },
  { id: "registros", label: "Registros", route: "/registros" },
];

type AuthUser = {
  id: string;
  email?: string;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("");
  const [user, setUser] = useState<AuthUser | null>(null);

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

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          id: user.id,
          email: user.email,
        });
      } else {
        setUser(null);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };  

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
              const isActive =
                pathname === "/" ? activeSection === link.id : pathname === link.route;

              return (
                <Link
                  key={link.route}
                  href={
                    link.id === "registros"
                      ? link.route
                      : pathname === "/"
                        ? `#${link.id}`
                        : link.route
                  }
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

          {user && (
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand)]/10 text-sm font-semibold text-[color:var(--brand)]">
                {user.email?.charAt(0).toUpperCase() ?? "U"}
              </div>

              <div className="max-w-[180px]">
                <p className="truncate text-sm font-medium text-slate-900">
                  {user.email}
                </p>
                <p className="text-xs text-slate-500">Usuario interno</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-black/10 px-3 py-2 text-sm text-slate-700 transition hover:bg-black/5"
              >
                Salir
              </button>
            </div>
          )}

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