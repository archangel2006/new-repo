"use client";

import { forwardRef, useCallback, useEffect } from "react";
import NextLink from "next/link";
import { usePathname as useNextPathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation";

export function usePathname() {
  return useNextPathname();
}

export const Link = forwardRef(function Link({ to, href, ...props }, ref) {
  return <NextLink ref={ref} href={href ?? to ?? "/"} {...props} />;
});

export const NavLink = forwardRef(function NavLink({ to, href, className, end = false, ...props }, ref) {
  const pathname = useNextPathname();
  const target = href ?? to ?? "/";
  const isActive = end ? pathname === target : pathname === target || pathname.startsWith(`${target}/`);
  const resolvedClassName = typeof className === "function"
    ? className({ isActive, isPending: false })
    : className;

  return (
    <NextLink
      href={target}
      ref={ref}
      className={resolvedClassName}
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  );
});

export function useNavigate() {
  const router = useRouter();

  return useCallback((destination, options = {}) => {
    if (typeof destination === "number") {
      router.back();
      return;
    }
    if (options.replace) router.replace(destination);
    else router.push(destination);
  }, [router]);
}

export function Navigate({ to, replace = false }) {
  const router = useRouter();

  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [replace, router, to]);

  return null;
}

export function useLocation() {
  const pathname = useNextPathname();
  const searchParams = useNextSearchParams();
  return {
    pathname,
    search: searchParams.size ? `?${searchParams.toString()}` : "",
    hash: typeof window === "undefined" ? "" : window.location.hash,
  };
}

export function useSearchParams() {
  return [useNextSearchParams()];
}

export function useParams() {
  const pathname = useNextPathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "bugs" && segments[1] && segments[1] !== "new") {
    return { id: decodeURIComponent(segments[1]) };
  }
  return {};
}
