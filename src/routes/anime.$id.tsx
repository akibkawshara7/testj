import { useMemo, useState, useRef, useEffect } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient, useIsFetching } from "@tanstack/react-query";
import {
  Play,
  Share2,
  Bookmark,
  Calendar,
  Star,
  Clock,
  LayoutGrid,
  ChevronRight,
  TrendingUp,
  Award,
  Video,
  ChevronDown,
  Loader2,
  Plus,
  Check,
  MoreHorizontal,
  Info,
  Layers,
  ChevronLeft,
  ChevronUp,
  Link2,
} from "lucide-react";

import { SharedSelect } from "@/components/SharedSelect";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
function sortRelations(relations: { relationType: string; node: AnilistMedia }[]) {
  return [...relations].sort((a, b) => {
    const typeA = a.relationType?.toUpperCase() || "";
    const typeB = b.relationType?.toUpperCase() || "";

    const priority = (type: string) => {
      if (type === "SEQUEL") return 1;
      if (type === "PREQUEL") return 2;
      return 3;
    };

    const pA = priority(typeA);
    const pB = priority(typeB);

    if (pA !== pB) return pA - pB;

    const scoreA = a.node.averageScore || a.node.meanScore || 0;
    const scoreB = b.node.averageScore || b.node.meanScore || 0;
    if (scoreA !== scoreB) return scoreB - scoreA;

    return (b.node.popularity || 0) - (a.node.popularity || 0);
  });
}

import { AnimeCard } from "@/components/AnimeCard";
import { useAuth } from "@/lib/auth";
import { AnimeRowShell } from "@/components/AnimeRow";
import { LinksPopup } from "@/components/LinksPopup";
import {
  SortDescIcon,
  SortAscIcon,
  RefreshCwIcon,
  useContentSortOrder,
} from "@/components/SortIcons";
import {
  fetchAnimeById,
  fetchEpisodes,
  stripHtml,
  titleOf,
  totalEpisodeCount,
  prettyFormat,
  type AnilistMedia,
  type Episode,
} from "@/lib/anilist";
import { encodeId, decodeId } from "@/lib/id-codec";
import { getScoreColor, formatScore, formatStatus, getStatusColor } from "@/lib/utils";

export const Route = createFileRoute("/anime/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Anime · AniKume` },
      { name: "description", content: `Watch anime ${params.id} on AniKume.` },
    ],
  }),
  component: AnimeDetail,
});

function AnimeDetail() {
  const { id } = Route.useParams();
  const rawId = String(id);
  let resolvedId: string | number = rawId;

  const decoded = decodeId(rawId);
  if (typeof decoded === "number" && !Number.isNaN(decoded)) {
    resolvedId = decoded;
  } else if (typeof decoded === "string" && decoded.startsWith("am")) {
    resolvedId = decoded;
  } else {
    resolvedId = rawId;
  }

  const {
    data: m,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["anime", resolvedId],
    queryFn: () => fetchAnimeById(resolvedId),
    staleTime: Infinity,
  });

  const ready = !!m;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pb-6">
        {isLoading && !m && <DetailSkeleton />}
        {error && (
          <p className="px-6 pt-32 text-center text-sm text-destructive">Failed to load anime.</p>
        )}
        {m && <DetailBody m={m} />}
      </main>
      <Footer />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div>
      {/* Banner Skeleton */}
      <div className="relative h-[25vh] min-h-[220px] w-full skeleton-box border-none sm:h-[35vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
        <div className="absolute -bottom-1 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="relative z-10 -mt-24 sm:-mt-32 lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
          {/* Poster Column */}
          <div className="relative z-10 flex justify-center lg:block">
            <div className="w-44 sm:w-52 lg:w-full">
              <div className="aspect-[2/3] w-full rounded-2xl skeleton-box shadow-2xl" />
            </div>
          </div>

          {/* Right Info Column */}
          <div className="mt-5 text-center lg:mt-24 lg:text-left">
            {/* Title Skeleton */}
            <div className="h-8 w-3/4 max-w-md mx-auto sm:h-10 lg:mx-0 skeleton-text" />

            {/* Badges Skeleton */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start">
              <div className="h-7 w-16 rounded-xl skeleton-box" />
              <div className="h-7 w-24 rounded-xl skeleton-box" />
              <div className="h-7 w-28 rounded-xl skeleton-box" />
              <div className="h-7 w-20 rounded-xl skeleton-box" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <div className="h-10 w-32 rounded-full skeleton-box" />
              <div className="size-10 rounded-full skeleton-box" />
              <div className="size-10 rounded-full skeleton-box" />
            </div>
          </div>
        </div>

        {/* Unified Tabs Bar Skeleton */}
        <div className="mt-8 flex w-full max-w-[500px] items-center rounded-full border border-white/5 bg-zinc-950/60 p-1 mx-auto lg:mx-0">
          <div className="h-7 w-1/4 rounded-full skeleton-box" />
          <div className="flex-1 flex justify-center">
            <div className="h-3 w-14 rounded-full bg-white/5" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="h-3 w-14 rounded-full bg-white/5" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="h-3 w-16 rounded-full bg-white/5" />
          </div>
        </div>

        {/* Overview Tab Content Skeleton */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-10 lg:gap-8">
          <div className="space-y-4 lg:col-span-6">
            <div className="aspect-video w-full rounded-2xl skeleton-box" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-28 skeleton-text" />
              <div className="h-4 w-full skeleton-text" />
              <div className="h-4 w-full skeleton-text" />
              <div className="h-4 w-4/5 skeleton-text" />
              <div className="h-4 w-2/3 skeleton-text opacity-70" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-5 w-20 skeleton-text" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-20 rounded-full skeleton-box" />
              <div className="h-7 w-24 rounded-full skeleton-box" />
              <div className="h-7 w-16 rounded-full skeleton-box" />
            </div>
            <div className="h-5 w-24 skeleton-text pt-2" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-16 rounded-full skeleton-box" />
              <div className="h-7 w-20 rounded-full skeleton-box" />
              <div className="h-7 w-28 rounded-full skeleton-box" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = ["Overview", "Episodes", "Related", "Characters"] as const;
type Tab = (typeof TABS)[number];

function DetailBody({ m }: { m: AnilistMedia }) {
  const { toggleWatchlist, isInWatchlist } = useAuth();
  const [tab, setTab] = useState<Tab>("Overview");
  const [linksOpen, setLinksOpen] = useState(false);
  const isBookmarked = isInWatchlist(m.id, "anime");
  const score = m.averageScore ?? m.meanScore;
  const notReleased = m.status === "NOT_YET_RELEASED" || m.status?.toUpperCase() === "UPCOMING";

  const isAdultTag =
    m.isAdult ||
    (m.genres || []).some(
      (g: string) => g.toLowerCase() === "hentai" || g.toLowerCase() === "adult",
    );

  const continueWatchingItem = useMemo(() => {
    try {
      const raw = localStorage.getItem("continue_watching_list");
      if (raw) {
        const list = JSON.parse(raw);
        return list.find((item: any) => item.animeId === m.id);
      }
    } catch {}
    return null;
  }, [m.id]);

  const continueEpNum = continueWatchingItem?.episodeNum;

  const queryClient = useQueryClient();
  const [isRefreshingEps, setIsRefreshingEps] = useState(false);

  const {
    data: episodesData,
    isLoading: epLoading,
    isFetching: epFetching,
  } = useQuery({
    queryKey: ["episodes", m.id],
    queryFn: () => fetchEpisodes(m.id, m),
    staleTime: Infinity,
    enabled: !notReleased,
  });

  const handleRefreshEpisodes = async () => {
    try {
      setIsRefreshingEps(true);
      try {
        const strId = String(m.id);
        const pureId = strId.startsWith("am") ? strId.slice(2) : strId;
        localStorage.removeItem(`episodes_cache_${strId}`);
        localStorage.removeItem(`episodes_cache_${pureId}`);
        if (m.idMal) {
          localStorage.removeItem(`episodes_cache_${m.idMal}`);
        }
      } catch {}
      queryClient.removeQueries({ queryKey: ["episodes", m.id] });
      await queryClient.fetchQuery({
        queryKey: ["episodes", m.id],
        queryFn: () => fetchEpisodes(m.id, m, true),
      });
    } finally {
      setIsRefreshingEps(false);
    }
  };

  const total = totalEpisodeCount(m, episodesData);

  const firstEpisodeNum = useMemo(() => {
    if (!episodesData || episodesData.length === 0) return "1";
    const minEp = Math.min(
      ...episodesData.map((e: any) =>
        typeof e.episode === "number" ? e.episode : Number(e.number) || 1,
      ),
    );
    return Number.isFinite(minEp) && minEp > 0 ? String(minEp) : "1";
  }, [episodesData]);

  const firstExtLink = m.externalLinks?.[0];
  const primaryExtUrl = firstExtLink?.url || `https://anilist.co/anime/${m.id}`;
  const primaryExtName = firstExtLink?.site || "AniList";
  const primaryExtIcon =
    firstExtLink?.icon ||
    "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://anilist.co&size=128";

  return (
    <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Banner */}
      <div className="relative h-[25vh] min-h-[220px] w-full overflow-hidden sm:h-[35vh]">
        <img
          src={m.bannerImage ?? m.coverImage.extraLarge}
          alt=""
          referrerPolicy="no-referrer"
          decoding="async"
          loading="eager"
          className="size-full scale-105 object-cover object-[50%_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
        <div className="absolute -bottom-1 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="relative z-10 -mt-24 sm:-mt-32 lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
          <div className="relative z-10 flex justify-center lg:block">
            <div className="relative group/cover">
              <img
                src={m.coverImage.extraLarge}
                alt={titleOf(m)}
                referrerPolicy="no-referrer"
                decoding="async"
                loading="eager"
                className="aspect-[2/3] w-44 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 sm:w-52 lg:w-full animate-in fade-in zoom-in-95 duration-300"
              />
              {isAdultTag && (
                <span className="pointer-events-none absolute top-2 right-2 z-10 rounded-md bg-red-600/90 px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
                  18+
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 text-center lg:mt-24 lg:text-left">
            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl">
              {titleOf(m)}
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm lg:justify-start">
              {score != null && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-white/10"
                  style={{ color: getScoreColor(score) }}
                >
                  <Star className="size-3.5 fill-current" />
                  {formatScore(score)}
                </span>
              )}
              {m.status && (
                <span
                  className={`rounded-xl bg-white/5 px-3 py-1.5 uppercase tracking-wider ring-1 ring-white/10 ${getStatusColor(m.status)}`}
                >
                  {formatStatus(m.status)}
                </span>
              )}
              {total > 0 && (
                <span className="rounded-xl bg-white/5 px-3 py-1.5 uppercase tracking-wider ring-1 ring-white/10 text-foreground/90">
                  {total} Episodes
                </span>
              )}
              {m.format && (
                <span className="rounded-xl bg-white/5 px-3 py-1.5 uppercase tracking-wider ring-1 ring-white/10 text-foreground/90">
                  {prettyFormat(m)}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {notReleased ? (
                <button
                  disabled
                  title="Not yet released"
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background opacity-50 transition"
                >
                  <Play className="size-4 fill-current" /> Play Now
                </button>
              ) : isRefreshingEps ? (
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background opacity-90 transition"
                >
                  <Loader2 className="size-4 animate-spin" /> Updating Episodes...
                </button>
              ) : !episodesData && (epLoading || epFetching) ? (
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background opacity-50 transition"
                >
                  <Loader2 className="size-4 animate-spin" /> Loading Episodes...
                </button>
              ) : continueEpNum ? (
                <Link
                  to="/anime/watch/$id"
                  params={{ id: encodeId(m.id, "anime") }}
                  hash={String(continueEpNum)}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition hover:scale-[1.02]"
                >
                  <Play className="size-4 fill-current" /> Continue Ep {continueEpNum}
                </Link>
              ) : (
                <Link
                  to="/anime/watch/$id"
                  params={{ id: encodeId(m.id, "anime") }}
                  hash={firstEpisodeNum}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition hover:scale-[1.02]"
                >
                  <Play className="size-4 fill-current" /> Play Now
                </Link>
              )}
              <a
                href={primaryExtUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={primaryExtName}
                title={primaryExtName}
                className="grid size-10 place-items-center rounded-full bg-white/5 text-foreground/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-foreground"
              >
                <img
                  src={primaryExtIcon}
                  alt={primaryExtName}
                  className="size-4 opacity-80 transition hover:opacity-100"
                />
              </a>
              <button
                onClick={() => setLinksOpen(true)}
                aria-label="External links"
                title="External links"
                className="grid size-10 place-items-center overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                <Link2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative mt-8 flex w-full max-w-[500px] items-center rounded-full border border-white/5 bg-zinc-950/60 p-1 mx-auto lg:mx-0">
          <div
            className="absolute bottom-1 top-1 left-1 rounded-full bg-white transition-transform duration-300 ease-out shadow-md"
            style={{
              width: `calc((100% - 8px) / ${TABS.length})`,
              transform: `translateX(calc(${TABS.indexOf(tab)} * 100%))`,
            }}
          />
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "relative z-10 flex-1 rounded-full py-2 text-[11px] font-bold transition-colors duration-300 sm:text-xs md:text-sm " +
                (tab === t ? "text-black" : "text-muted-foreground hover:text-foreground")
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div key={tab} className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {tab === "Overview" && <OverviewTab m={m} />}
          {tab === "Episodes" &&
            (notReleased ? (
              <div className="rounded-2xl border border-white/5 bg-card/30 p-10 text-center text-sm text-muted-foreground">
                Not yet released.
              </div>
            ) : (
              <EpisodesTab
                m={m}
                episodes={episodesData ?? []}
                total={total}
                onRefresh={handleRefreshEpisodes}
                isRefreshing={isRefreshingEps || epFetching}
              />
            ))}
          {tab === "Related" && <SeasonsTab m={m} />}
          {tab === "Characters" && <CharactersTab m={m} />}
        </div>

        <RelatedRow
          title="Recommendations"
          items={
            (m.recommendations?.nodes ?? [])
              .map((n) => n.mediaRecommendation)
              .filter(Boolean) as AnilistMedia[]
          }
        />
      </div>

      <LinksPopup
        open={linksOpen}
        onClose={() => setLinksOpen(false)}
        anilistId={m.id}
        extraLinks={m.externalLinks || []}
      />
    </article>
  );
}

/* ---------------------- Overview ---------------------- */
function OverviewTab({ m }: { m: AnilistMedia }) {
  const aired = formatAired(m);
  const ytId = m.trailer?.site === "youtube" ? m.trailer.id : null;
  const romaji = m.title.romaji;
  const formatLabel = m.format ? cap(m.format.replace(/_/g, " ").toLowerCase()) : null;
  const [expanded, setExpanded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const synopsis = stripHtml(m.description) || "No synopsis available.";

  return (
    <div className="grid gap-4 lg:grid-cols-10">
      {/* Left 60% */}
      <div className="space-y-4 lg:col-span-6">
        {/* Trailer + centred meta boxes */}
        {ytId ? (
          <div>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
              {!iframeLoaded && <div className="absolute inset-0 z-10 animate-pulse bg-white/10" />}
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
                className={`size-full transition-opacity duration-300 ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
            {aired && (
              <p className="mt-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {aired}
              </p>
            )}
          </div>
        ) : (
          (romaji || formatLabel || aired) && (
            <div className="flex flex-col gap-3">
              {(romaji || formatLabel) && <CenteredBox>{romaji || formatLabel}</CenteredBox>}
              {aired && (
                <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {aired}
                </p>
              )}
            </div>
          )
        )}

        {/* Synopsis with 15-line clamp + smooth expansion & animated chevron */}
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <Info className="size-3.5" />
            Synopsis
          </div>
          <div className="relative mt-3">
            <div
              className={`relative overflow-hidden transition-all duration-300 ${
                expanded ? "max-h-[1200px]" : "max-h-36 sm:max-h-44"
              }`}
            >
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
                {synopsis}
              </p>
              {!expanded && synopsis.length > 300 && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
              )}
            </div>
            {synopsis.length > 300 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] transition-colors duration-200 hover:text-white"
              >
                <span>{expanded ? "Show less" : "Show more"}</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right 40% */}
      <div className="lg:col-span-4">
        <InfoBox m={m} />
      </div>
    </div>
  );
}

function CenteredBox({ children }: { children: React.ReactNode }) {
  return <div className="text-center text-sm font-semibold text-foreground/90">{children}</div>;
}

function InfoBox({ m }: { m: AnilistMedia }) {
  // PC: always shown, no toggle. Mobile: collapsible with Show Info.
  const [open, setOpen] = useState(false);
  const studios = m.studios?.nodes ?? [];
  const synonyms = m.synonyms ?? [];
  const genres = m.genres ?? [];

  const body = (
    <div className="space-y-5">
      {studios.length > 0 && (
        <InfoSection label="Studios">
          {studios.map((s) => (
            <Chip key={s.id}>{s.name}</Chip>
          ))}
        </InfoSection>
      )}
      {synonyms.length > 0 && (
        <InfoSection label="Synonyms">
          {synonyms.slice(0, 8).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </InfoSection>
      )}
      {genres.length > 0 && (
        <InfoSection label="Genres">
          {genres.map((g) => (
            <Link
              key={g}
              to="/anime/browse"
              search={{ genre: g }}
              className="rounded-full border border-[var(--success,#14b8a6)]/40 bg-transparent px-3 py-1 text-[11px] font-semibold text-[var(--success,#14b8a6)] transition hover:bg-[var(--success,#14b8a6)]/10"
            >
              {g}
            </Link>
          ))}
        </InfoSection>
      )}
    </div>
  );

  return (
    <div>
      {/* Mobile-only toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground lg:hidden"
      >
        <Layers className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
        <span>{open ? "Hide Info" : "Show Info"}</span>
        <span className="ml-auto">
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {/* PC always-on header */}
      <div className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground lg:flex">
        <Layers className="size-3.5" />
        Info
      </div>

      <div
        className={
          "overflow-hidden transition-all duration-300 " +
          (open
            ? "mt-4 max-h-[800px] opacity-100 animate-in fade-in slide-in-from-top-2"
            : "max-h-0 opacity-0 lg:mt-4 lg:max-h-none lg:opacity-100")
        }
      >
        {body}
      </div>
    </div>
  );
}

function InfoSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-semibold text-foreground/85">
      {children}
    </span>
  );
}
function SeasonsTab({ m }: { m: AnilistMedia }) {
  const relationPriority = (type: string) => {
    const upper = type?.toUpperCase();
    if (upper === "PREQUEL") return 1;
    if (upper === "SEQUEL") return 2;
    return 3;
  };

  const relations = (m.relations?.edges ?? [])
    .filter(
      (r) =>
        r.node?.format !== "MANGA" && r.node?.format !== "NOVEL" && r.node?.format !== "ONE_SHOT",
    )
    .sort((a, b) => relationPriority(a.relationType) - relationPriority(b.relationType));

  if (relations.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">No related content.</div>
    );
  }

  return (
    <div className="-mt-6">
      <AnimeRowShell>
        {relations.map((r) => (
          <div
            key={r.node.id}
            className="group/badge relative shrink-0 w-[130px] sm:w-[165px] lg:w-[190px]"
          >
            <AnimeCard media={r.node} badge={null} />
            <span className="pointer-events-none absolute right-2 top-2 z-10 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur transition-transform duration-300 group-hover/badge:-translate-y-1">
              {r.relationType.replace(/_/g, " ")}
            </span>
          </div>
        ))}
      </AnimeRowShell>
    </div>
  );
}

function NextEpisodeCountdown({
  nextEp,
  banner,
}: {
  nextEp: { episode: number; airingAt: number };
  banner: string | null;
}) {
  const [timeLeft, setTimeLeft] = useState(() => nextEp.airingAt - Math.floor(Date.now() / 1000));

  useEffect(() => {
    setTimeLeft(nextEp.airingAt - Math.floor(Date.now() / 1000));
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextEp]);

  if (timeLeft <= 0) return null;

  const d = Math.floor(timeLeft / (3600 * 24));
  const h = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  parts.push(`${m}m`);

  return (
    <div className="mb-4 flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-white/5 bg-card/40 p-2 animate-in fade-in duration-300">
      <div className="relative grid aspect-video w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-black sm:w-36">
        {banner ? (
          <img
            src={banner}
            alt=""
            referrerPolicy="no-referrer"
            decoding="async"
            className="size-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-muted-foreground">EP {nextEp.episode}</span>
        )}
        <span className="absolute bottom-1 left-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
          EP {nextEp.episode}
        </span>
      </div>
      <div className="min-w-0 flex-1 pr-2">
        <p className="truncate text-sm font-bold">Soon in {parts.join(" ")}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground sm:text-xs">
          {new Date(nextEp.airingAt * 1000).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

/* ---------------------- Episodes ---------------------- */
function EpisodesTab({
  m,
  episodes,
  total,
  onRefresh,
  isRefreshing,
}: {
  m: AnilistMedia;
  episodes: Episode[];
  total: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const [sortOrder, setSortOrder] = useContentSortOrder();

  let count = total || episodes.length || m.episodes || 12;
  if (m.status === "RELEASING" && m.nextAiringEpisode) {
    count = Math.min(count, Math.max(0, m.nextAiringEpisode.episode - 1));
  }

  // Pre-index episodes by episode number for O(1) instant lookup
  const episodeMap = useMemo(() => {
    const map = new Map<number, Episode>();
    if (episodes) {
      for (let i = 0; i < episodes.length; i++) {
        map.set(episodes[i].episode, episodes[i]);
      }
    }
    return map;
  }, [episodes]);

  // Chunks of 50
  const ranges = useMemo(() => {
    const r: { label: string; start: number; end: number; id: number }[] = [];
    for (let s = 1; s <= count; s += 50) {
      const e = Math.min(s + 49, count);
      r.push({ label: `${s} - ${e}`, start: s, end: e, id: s });
    }
    if (sortOrder === "desc") {
      return r
        .slice()
        .reverse()
        .map((chunk) => ({
          label: `${chunk.end} - ${chunk.start}`,
          start: chunk.start,
          end: chunk.end,
          id: chunk.id,
        }));
    }
    return r;
  }, [count, sortOrder]);

  const [rangeIdx, setRangeIdx] = useState(0);

  useEffect(() => {
    setRangeIdx(0);
  }, [sortOrder]);

  const range = ranges[rangeIdx] ?? ranges[0] ?? { start: 1, end: count };

  type Item = {
    num: number;
    title: string;
    thumbnail: string | null;
    url: string | null;
    description: string | null;
  };

  const items: Item[] = useMemo(() => {
    const raw: Item[] = Array.from({ length: range.end - range.start + 1 }).map((_, i) => {
      const num = range.start + i;
      const ep = episodeMap.get(num);
      const fallback = m.streamingEpisodes?.[num - 1];
      return {
        num,
        title: ep?.title ?? fallback?.title ?? `Episode ${num}`,
        thumbnail: ep?.image ?? fallback?.thumbnail ?? null,
        url: fallback?.url ?? null,
        description: ep?.description ?? null,
      };
    });

    if (sortOrder === "desc") {
      return raw.reverse();
    }
    return raw;
  }, [range.start, range.end, episodeMap, m, sortOrder]);

  return (
    <div>
      {m.nextAiringEpisode && (
        <NextEpisodeCountdown
          nextEp={m.nextAiringEpisode}
          banner={m.bannerImage || m.coverImage.extraLarge || m.coverImage.large}
        />
      )}
      <div className="mb-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Pure White Episode Count */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            {count} Episodes
          </span>
        </div>

        {/* Right: Range Dropdown & Sort Chooser */}
        <div className="flex items-center gap-2">
          {ranges.length > 1 && (
            <div className="shrink-0 min-w-[100px] sm:min-w-[110px]">
              <SharedSelect
                value={String(rangeIdx)}
                options={ranges.map((r, i) => ({
                  value: String(i),
                  display: r.label,
                }))}
                onChange={(v) => setRangeIdx(Number(v))}
                triggerClassName="py-1.5 px-3 text-xs font-semibold text-white bg-card/60 border border-white/10"
              />
            </div>
          )}

          <button
            onClick={() => setSortOrder((v) => (v === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 bg-card/60 hover:bg-card text-white text-xs font-bold transition active:scale-95"
            title={
              sortOrder === "desc"
                ? "Order: Descending (Newest first)"
                : "Order: Ascending (Oldest first)"
            }
            aria-label={sortOrder === "desc" ? "Sort descending" : "Sort ascending"}
          >
            {sortOrder === "desc" ? (
              <SortDescIcon className="size-4 text-white" />
            ) : (
              <SortAscIcon className="size-4 text-white" />
            )}
          </button>
        </div>
      </div>

      <div>
        {isRefreshing ? (
          <div className="grid gap-2 lg:grid-cols-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-2"
              >
                <div className="aspect-video w-24 shrink-0 rounded-xl skeleton-box sm:w-36" />
                <div className="min-w-0 flex-1 space-y-2 pr-2">
                  <div className="h-4 w-3/4 skeleton-text" />
                  <div className="h-3 w-5/6 skeleton-text opacity-70" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-2 lg:grid-cols-2">
            {items.map((ep) => (
              <Link
                key={ep.num}
                to="/anime/watch/$id"
                params={{ id: encodeId(m.id, "anime") }}
                hash={String(ep.num)}
                className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-2 transition hover:border-[var(--brand)]/50 hover:bg-card/80"
              >
                <div className="relative grid aspect-video w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-black sm:w-36">
                  {ep.thumbnail ? (
                    <img
                      src={ep.thumbnail}
                      alt=""
                      referrerPolicy="no-referrer"
                      decoding="async"
                      loading="lazy"
                      className="size-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white/80">EP {ep.num}</span>
                  )}
                  <span className="absolute bottom-1 left-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white border border-white/10">
                    EP {ep.num}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <p className="truncate text-sm font-bold text-white group-hover:text-[var(--brand,#df7426)] transition-colors">
                    {ep.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-white/70 sm:text-xs">
                    {ep.description || stripHtml(m.description)?.slice(0, 120) || "—"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------- Characters ---------------------- */
function CharactersTab({ m }: { m: AnilistMedia }) {
  const characters = m.characters?.edges ?? [];
  if (characters.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-card/30 p-10 text-center text-sm text-muted-foreground">
        No characters available.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Characters
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-foreground/85 ring-1 ring-white/10">
          {characters.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {characters.map((c, i) => {
          const va = c.voiceActors[0];
          return (
            <div
              key={i}
              className="flex min-w-0 items-stretch gap-2 overflow-hidden rounded-2xl border border-white/5 bg-card/40 p-2"
            >
              <img
                src={c.node.image.large}
                alt=""
                referrerPolicy="no-referrer"
                decoding="async"
                loading="lazy"
                className="size-14 shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:size-16"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-center pl-1">
                <p className="truncate text-sm font-bold">{c.node.name.full}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {c.role.toLowerCase()}
                </p>
              </div>
              {va && (
                <>
                  <div className="flex min-w-0 flex-col items-end justify-center pr-1 text-right">
                    <p className="truncate text-sm font-bold">{va.name.full}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {va.languageV2}
                    </p>
                  </div>
                  <img
                    src={va.image.large}
                    alt=""
                    referrerPolicy="no-referrer"
                    decoding="async"
                    loading="lazy"
                    className="size-14 shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:size-16"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------- Related row using shared shell ---------------------- */
function RelatedRow({ title, items }: { title: string; items: AnilistMedia[] }) {
  if (items.length === 0) return null;
  return (
    <AnimeRowShell title={title}>
      {items.map((r) => (
        <AnimeCard key={r.id} media={r} badge={null} />
      ))}
    </AnimeRowShell>
  );
}

/* ---------------------- helpers ---------------------- */
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function formatAired(m: AnilistMedia) {
  const start = m.startDate;
  const end = m.endDate;
  const fmt = (d?: { year: number | null; month: number | null; day: number | null }) => {
    if (!d || !d.year) return null;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const mo = d.month ? months[d.month - 1] : "";
    return `${mo}${d.day ? ` ${d.day},` : ""} ${d.year}`.trim();
  };
  const s = fmt(start);
  const e = fmt(end);
  if (!s) return null;
  if (!e || (start.year === end?.year && start.month === end?.month && start.day === end?.day))
    return `Aired ${s}`;
  return `Aired ${s} — ${e}`;
}
