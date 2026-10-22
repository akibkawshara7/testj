import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";

export function UniversalClock() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !now) {
    return (
      <div className="flex flex-wrap items-center gap-2 mt-4 text-xs sm:text-sm font-medium text-muted-foreground/80 bg-white/5 rounded-full px-3 py-1.5 w-fit border border-white/5">
        <Clock className="size-3.5 text-primary" />
        <span className="opacity-70">Schedule adapts to your local time automatically</span>
      </div>
    );
  }

  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div
      suppressHydrationWarning
      className="flex flex-wrap items-center gap-2 mt-4 text-xs sm:text-sm font-medium text-muted-foreground/80 bg-white/5 rounded-full px-3 py-1.5 w-fit border border-white/5"
    >
      <Clock className="size-3.5 text-primary" />
      <span suppressHydrationWarning>{format(now, "hh:mm:ss a")}</span>
      <span className="opacity-70 px-1">•</span>
      <span suppressHydrationWarning>{timeZoneName}</span>
      <span className="opacity-70 px-1">•</span>
      <span className="opacity-70">Schedule adapts to your local time automatically</span>
    </div>
  );
}
