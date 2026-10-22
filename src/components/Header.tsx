import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Home, Compass, Calendar, User, Bell, LogOut, Settings, LogIn } from "lucide-react";
import { Logo } from "./Logo";
import { SearchModal, useSearchHotkey } from "./SearchModal";
import * as Popover from "@radix-ui/react-popover";
import { useAuth } from "../lib/auth";
import { UserAvatar } from "./UserAvatar";

type NavItem = {
  label: string;
  to: string;
  icon: typeof Home;
  disabled?: boolean;
  exact?: boolean;
  comingSoon?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", to: "/", icon: Home, exact: true },
  { label: "Browse", to: "/anime/browse", icon: Compass },
];

export function useAppMode() {
  return false; // App is exclusively Anime
}

function UserMenuPopover() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthed = mounted && isAuthenticated && !!user;

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
      <Popover.Trigger asChild>
        <button
          aria-label="Account"
          title={isAuthed ? user.username : "Account & Settings"}
          className="relative grid size-11 place-items-center rounded-full bg-white/5 text-foreground/80 ring-1 ring-white/10 backdrop-blur-md transition hover:bg-white/10 hover:text-foreground cursor-pointer"
        >
          {isAuthed ? (
            <UserAvatar
              avatarUrl={user.settings?.avatarUrl}
              frameUrl={user.settings?.frameUrl}
              username={user.username}
              size="header"
            />
          ) : (
            <User className="size-5" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={10}
          className="z-[9999] bg-black/85 ring-1 ring-white/10 backdrop-blur-xl w-[220px] rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
        >
          {isAuthed ? (
            <>
              {/* User Details Header */}
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    avatarUrl={user.settings?.avatarUrl}
                    frameUrl={user.settings?.frameUrl}
                    username={user.username}
                    size="sm"
                  />
                  <div className="overflow-hidden">
                    <p className="truncate text-xs font-bold text-white">{user.username}</p>
                    <p className="truncate text-[10px] text-white/50">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items: Settings and Logout */}
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/settings" });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="size-4 text-white/70" />
                  <span>Settings</span>
                </button>

                <div className="my-1 border-t border-white/10" />

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAuthModal("signin");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LogIn className="size-4 text-white" />
                <span>Login</span>
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  useSearchHotkey(() => setSearchOpen(true));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6">
          <Logo className="shrink-0" />
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <IconBtn label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="size-5" />
            </IconBtn>
            <UserMenuPopover />
          </div>
        </div>
      </header>

      <BottomNav />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-2.5 left-1/2 z-50 -translate-x-1/2 duration-300 animate-in fade-in slide-in-from-bottom-4 sm:bottom-4">
      <div className="flex items-center gap-1 rounded-full bg-black/80 p-1 ring-1 ring-white/10 backdrop-blur-md sm:gap-1.5 sm:p-1.5">
        {navItems.map((n, idx) => {
          const Icon = n.icon;
          const cls = "grid size-8 sm:size-9 place-items-center rounded-full transition-colors";
          return (
            <Link
              key={idx}
              to={n.to}
              activeOptions={n.exact ? { exact: true } : undefined}
              aria-label={n.label}
              title={n.label}
              className={
                cls +
                " text-muted-foreground hover:bg-white/10 hover:text-foreground data-[status=active]:bg-white/15 data-[status=active]:text-foreground"
              }
            >
              <Icon className="size-4" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  title,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      aria-label={label}
      title={title ?? label}
      onClick={onClick}
      className="relative grid size-11 place-items-center rounded-full bg-white/5 text-foreground/80 ring-1 ring-white/10 backdrop-blur-md transition hover:bg-white/10 hover:text-foreground cursor-pointer"
    >
      {children}
    </button>
  );
}
