"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Settings,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { useCart } from "@/components/site/cart-context";
import { CustomerNotifications } from "@/components/site/customer-notifications";
import { formatChf } from "@/lib/orders";
import { saharRealContent } from "@/content/phase-1";

type SiteUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
} | null;

export function SiteShell({ locale, user, children }: { locale: "de" | "en"; user?: SiteUser; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { count, items } = useCart();
  const other = locale === "de" ? "en" : "de";

  // Total cart price for mobile bar
  const cartTotalRappen = items.reduce((sum, item) => sum + item.unitPriceRappen * item.quantity, 0);


  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const labels = locale === "de"
    ? {
        home: "Startseite",
        menu: "Speisekarte",
        about: "Über uns",
        contact: "Kontakt",
        account: "Meine Bestellungen",
        profile: "Mein Profil",
        logout: "Abmelden",
        login: "Anmelden",
        register: "Registrieren",
        cart: "Warenkorb",
        language: "English",
        hours: "Öffnungszeiten",
        quickLinks: "Schnelllinks",
        tagline: "Persische Kochkunst & Gastfreundschaft in Zürich Wallisellen.",
        monFri: "Mo – Fr",
        sat: "Samstag",
        sun: "Sonntag",
        closed: "Geschlossen",
        rights: "Alle Rechte vorbehalten.",
        privacy: "Datenschutz",
        terms: "AGB",
        welcomeGuest: "Willkommen bei SAHAR",
      }
    : {
        home: "Home",
        menu: "Menu",
        about: "About",
        contact: "Contact",
        account: "My Orders",
        profile: "My Profile",
        logout: "Sign Out",
        login: "Sign In",
        register: "Sign Up",
        cart: "Cart",
        language: "Deutsch",
        hours: "Opening Hours",
        quickLinks: "Quick Links",
        tagline: "Persian Culinary Art & Hospitality in Zurich Wallisellen.",
        monFri: "Mon – Fri",
        sat: "Saturday",
        sun: "Sunday",
        closed: "Closed",
        rights: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms & Conditions",
        welcomeGuest: "Welcome to SAHAR",
      };

  const navLinks = [
    { href: `/${locale}`, label: labels.home },
    { href: `/${locale}/menu`, label: labels.menu },
    { href: `/${locale}/about`, label: labels.about },
    { href: `/${locale}/contact`, label: labels.contact },
  ];

  function isActive(href: string) {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname?.startsWith(href);
  }

  const switchLangPath = pathname ? pathname.replace(`/${locale}`, `/${other}`) : `/${other}`;

  async function handleSignOut() {
    setUserDropdownOpen(false);
    await signOut({ callbackUrl: `/${locale}` });
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex min-h-dvh flex-col" lang={locale}>
      {/* Accessible Skip Link */}
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-white focus:shadow-2xl focus:ring-2 focus:ring-secondary"
        href="#main-content"
      >
        {locale === "de" ? "Zum Inhalt springen" : "Skip to content"}
      </a>

      {/* MODERN FLOATING NAVBAR */}
      <div className="sticky top-3 z-40 px-3 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-7xl rounded-2xl border border-border/70 bg-surface/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            
            {/* Brand Logo */}
            <Link href={`/${locale}`} className="group flex items-center gap-3 py-1.5 transition-transform hover:scale-[1.02]">
              <div className="relative h-10 w-28 sm:h-11 sm:w-40">
                <Image
                  src="/brand/sahar-logo.png"
                  alt="SAHAR Restaurant Logo"
                  fill
                  priority
                  sizes="(max-width: 639px) 112px, 160px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative min-h-10 content-center rounded-xl px-4 text-sm font-bold transition-all duration-200 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/80 hover:bg-background hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-1 sm:gap-2.5">
              {user?.role === "CUSTOMER" && <CustomerNotifications locale={locale} />}
              {/* Language Switcher */}
              <Link
                href={switchLangPath}
                hrefLang={other}
                className="hidden min-h-9 items-center rounded-full border border-border/80 bg-surface-warm/60 px-3 py-1 text-xs font-bold text-foreground/80 transition-all hover:border-secondary hover:bg-surface-warm hover:text-primary sm:inline-flex"
                aria-label={`Switch language to ${labels.language}`}
              >
                <span className="mr-1 font-black text-secondary">{other.toUpperCase()}</span>
                <span className="hidden xs:inline">{labels.language}</span>
              </Link>

              {/* Cart Button */}
              <Link
                href={`/${locale}/cart`}
                className="relative inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                aria-label={`${labels.cart} (${count} ${locale === "de" ? "Artikel" : "items"})`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">{labels.cart}</span>
                {count > 0 && (
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary px-1 text-xs font-black text-secondary-foreground shadow animate-pulse-badge">
                    {count}
                  </span>
                )}
              </Link>

              {/* FAR-RIGHT USER ICON & DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  className="flex min-h-10 min-w-10 items-center justify-center rounded-full border-2 border-secondary/50 bg-secondary/10 text-primary transition-all hover:border-secondary hover:bg-secondary/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
                  aria-expanded={userDropdownOpen}
                  aria-label="User Account Menu"
                >
                  {user ? (
                    user.image ? (
                      <Image src={user.image} alt={user.name ?? "User"} width={32} height={32} className="rounded-full object-cover" />
                    ) : (
                      <span className="font-display font-extrabold text-sm text-primary">{userInitial}</span>
                    )
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </button>

                {/* DROPDOWN MENU */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 top-12 z-50 min-w-[16rem] overflow-hidden rounded-2xl border border-border/80 bg-surface/98 p-2 shadow-2xl backdrop-blur-xl animate-scale-in"
                  >
                    {user ? (
                      <div>
                        {/* User Profile Header */}
                        <div className="rounded-xl bg-surface-warm p-3 space-y-1">
                          <p className="font-display text-sm font-bold text-primary leading-tight truncate">
                            {user.name ?? "User"}
                          </p>
                          <p className="text-xs text-muted truncate">{user.email}</p>
                          {user.role && user.role !== "CUSTOMER" && (
                            <span className="inline-block mt-1 rounded bg-secondary/20 px-2 py-0.5 text-[10px] font-bold text-secondary-light">
                              {user.role}
                            </span>
                          )}
                        </div>

                        <div className="my-2 border-t border-border/60" />

                        {/* Menu Options */}
                        <div className="space-y-1">
                          <Link
                            href={`/${locale}/account/orders`}
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <ShoppingBag className="h-4 w-4 text-secondary" />
                            <span>{labels.account}</span>
                          </Link>

                          {user.role && user.role !== "CUSTOMER" && (
                            <Link
                              href="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Settings className="h-4 w-4 text-secondary" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                        </div>

                        <div className="my-2 border-t border-border/60" />

                        {/* Sign Out Button */}
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4 text-destructive" />
                          <span>{labels.logout}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 space-y-3">
                        <div className="px-2 pt-1">
                          <p className="font-display text-sm font-bold text-primary">{labels.welcomeGuest}</p>
                          <p className="text-xs text-muted mt-0.5">{locale === "de" ? "Melden Sie sich an, um Bestellungen zu verfolgen." : "Sign in to track your orders."}</p>
                        </div>

                        <div className="space-y-2 pt-1">
                          <Link
                            href={`/${locale}/login`}
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex min-h-10 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow hover:bg-primary-light transition-all"
                          >
                            {labels.login}
                          </Link>
                          <Link
                            href={`/${locale}/register`}
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex min-h-10 w-full items-center justify-center rounded-xl border border-primary/30 text-sm font-bold text-primary hover:bg-primary/5 transition-all"
                          >
                            {labels.register}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                className="inline-flex min-h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground hover:bg-background md:hidden focus:outline-none focus:ring-2 focus:ring-secondary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-border/60 bg-surface/98 p-4 backdrop-blur-xl md:hidden animate-fade-in rounded-b-2xl">
              <nav className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex min-h-11 items-center rounded-xl px-4 font-bold text-sm transition-colors ${
                      isActive(link.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-background"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-2 border-t border-border/60" />

                {user ? (
                  <div className="space-y-1.5">
                    <Link
                      href={`/${locale}/account/orders`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-11 items-center gap-3 rounded-xl px-4 font-bold text-sm text-foreground hover:bg-background"
                    >
                      <ShoppingBag className="h-4 w-4 text-secondary" />
                      <span>{labels.account}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 font-bold text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{labels.logout}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/${locale}/login`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-10 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground"
                    >
                      {labels.login}
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-10 items-center justify-center rounded-xl border border-primary/30 text-xs font-bold text-primary"
                    >
                      {labels.register}
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </header>
      </div>

      {/* Main Content Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none pt-20 sm:pt-24">
        {children}
      </main>

      {/* Horizon Decorative Divider */}
      <div className="horizon-divider mt-16" />

      {/* Rich Footer */}
      <footer className="border-t border-border/80 bg-surface text-foreground/90">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Column 1: Brand & Tagline */}
            <div className="space-y-4">
              <div className="relative h-12 w-44">
                <Image
                  src="/brand/sahar-logo.png"
                  alt="SAHAR Logo"
                  fill
                  sizes="176px"
                  className="object-contain object-left"
                />
              </div>
              <p className="text-sm leading-6 text-muted">
                {labels.tagline}
              </p>
              <div className="pt-2">
                <a
                  href={saharRealContent.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-secondary hover:text-primary"
                >
                  {/* Instagram icon — not in lucide-react, using brand SVG */}
                  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>@saharzurich</span>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-display text-base font-bold text-primary">{labels.quickLinks}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href={`/${locale}/menu`} className="text-muted transition-colors hover:text-primary">{labels.menu}</Link></li>
                <li><Link href={`/${locale}/about`} className="text-muted transition-colors hover:text-primary">{labels.about}</Link></li>
                <li><Link href={`/${locale}/contact`} className="text-muted transition-colors hover:text-primary">{labels.contact}</Link></li>
                <li><Link href={`/${locale}/account/orders`} className="text-muted transition-colors hover:text-primary">{labels.account}</Link></li>
                <li><Link href={`/${locale}/cart`} className="text-muted transition-colors hover:text-primary">{labels.cart}</Link></li>
              </ul>
            </div>

            {/* Column 3: Opening Hours */}
            <div>
              <h3 className="font-display text-base font-bold text-primary">{labels.hours}</h3>
              <dl className="mt-4 space-y-2 text-sm text-muted">
                <div className="flex justify-between">
                  <dt>{labels.monFri}</dt>
                  <dd className="font-medium text-foreground">{saharRealContent.openingHours.mondayToFriday}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{labels.sat}</dt>
                  <dd className="font-medium text-foreground">{saharRealContent.openingHours.saturday}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{labels.sun}</dt>
                  <dd className="font-semibold text-destructive">{labels.closed}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted/80">{saharRealContent.openingHours.holidayNote}</p>
            </div>

            {/* Column 4: Location & Contact */}
            <div>
              <h3 className="font-display text-base font-bold text-primary">{labels.contact}</h3>
              <address className="mt-4 not-italic space-y-2.5 text-sm text-muted">
                <p className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-secondary mt-0.5" />
                  <span>{saharRealContent.address.street}, {saharRealContent.address.postalCode} {saharRealContent.address.city}</span>
                </p>
                <p>
                  <a href={`tel:${saharRealContent.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 transition-colors hover:text-primary">
                    <Phone className="h-5 w-5 shrink-0 text-secondary" />
                    <span>{saharRealContent.phone}</span>
                  </a>
                </p>
                <p>
                  <a href={`mailto:${saharRealContent.email}`} className="flex items-center gap-2 transition-colors hover:text-primary">
                    <Mail className="h-5 w-5 shrink-0 text-secondary" />
                    <span>{saharRealContent.email}</span>
                  </a>
                </p>
              </address>
            </div>

          </div>

          {/* Bottom Legal Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted sm:flex-row">
            <p>© {new Date().getFullYear()} {saharRealContent.legalBusinessName}. {labels.rights}</p>
            <div className="flex gap-6">
              <Link href={`/${locale}/privacy`} className="transition-colors hover:text-primary">{labels.privacy}</Link>
              <Link href={`/${locale}/terms`} className="transition-colors hover:text-primary">{labels.terms}</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* MOBILE FLOATING CART BAR — appears when cart has items */}
      {count > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 sm:hidden animate-scale-in">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/cart`)}
            className="flex min-h-14 min-w-[280px] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 rounded-2xl bg-primary px-5 text-primary-foreground shadow-2xl ring-1 ring-black/10 hover:bg-primary-light active:scale-[0.98] transition-all"
            aria-label={locale === "de" ? `Warenkorb ansehen — ${count} Artikel` : `View cart — ${count} items`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <div className="text-left">
                <span className="block text-xs font-semibold opacity-80">
                  {count} {locale === "de" ? (count === 1 ? "Artikel" : "Artikel") : (count === 1 ? "item" : "items")}
                </span>
                <span className="block text-sm font-extrabold">
                  {locale === "de" ? "Warenkorb ansehen" : "View cart"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-display text-base font-extrabold">
                {formatChf(cartTotalRappen, locale)}
              </span>
              <ChevronRight className="h-5 w-5 opacity-70" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
