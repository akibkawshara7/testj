import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity, // Keep data fresh in session memory indefinitely - never re-fetch visited pages
        gcTime: Infinity, // Keep query responses in memory for the whole session
        refetchOnWindowFocus: false, // Prevent background re-fetching lag
        refetchOnMount: false, // Instant 0ms return to previously visited pages
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: Infinity,
  });

  return router;
};
