import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={"group inline-flex items-center " + className}
      aria-label="AniKume home"
    >
      <img
        src="/logo.png"
        alt="AniKume"
        className="h-9 w-auto select-none sm:h-11 transition-transform group-hover:scale-105"
        draggable={false}
      />
    </Link>
  );
}
