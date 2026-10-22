import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notification")({
  head: () => ({
    meta: [
      { title: "Notifications · AniKume" },
      { name: "description", content: "View your notifications on AniKume." },
    ],
  }),
  component: NotificationPage,
});

function NotificationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center pt-20 px-4 duration-300 animate-in fade-in">
        <div className="flex flex-col items-center justify-center text-center max-w-md">
          <div className="grid size-20 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 mb-6">
            <Bell className="size-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">No Notifications</h1>
          <p className="text-sm text-muted-foreground">
            You're all caught up! We'll notify you when there's something new.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
